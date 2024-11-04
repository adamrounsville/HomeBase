'use client'

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import React, { useEffect, useRef, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: string) => void;
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

const HomeBaseLocationModal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, onPlaceSelect }) => {
  const [address, setAddress] = useState<string>('');
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [placeAutocomplete, setPlaceAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');

  const handleSave = async () => {
    if (!selectedPlace?.formatted_address) {
      console.error('No valid address selected');
      return;
    }

    if (localStorage.getItem('homebaseLocation') !== selectedPlace.formatted_address) {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/homebase`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(selectedPlace.formatted_address),
        });

        if (!response.ok) throw new Error('Failed to save address');

        const data = await response.json();
        localStorage.setItem('userId', data.uuid);
        onSave(selectedPlace.formatted_address);
      } catch (error) {
        console.error('Error saving address:', error);
      } finally {
        setIsLoading(false);
      }
    }
    onClose();
  };

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      componentRestrictions: { country: "us" },
      fields: ["address_components", "geometry", "icon", "name", "place_id", "adr_address", "formatted_address"],
      strictBounds: false,
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener('place_changed', () => {
      const place = placeAutocomplete.getPlace();
      setSelectedPlace(place);
      onPlaceSelect(place);
      if (place.formatted_address) {
        setAddress(place.formatted_address);
      }
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <div className={`overlay ${isOpen ? 'show' : 'hide'}`}>
      <div className="modal">
        <h2>Enter Address</h2>
        <Input
          ref={inputRef}
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your home base address"
          className="input"
        />
        <div className="buttons">
          <Button
            onClick={handleSave}
            className="button save-button"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
          <Button
            onClick={onClose}
            className="button close-button"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomeBaseLocationModal;