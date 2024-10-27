"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {useMapsLibrary } from '@vis.gl/react-google-maps';
import React, { useEffect, useRef, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: string) => void;
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

const HomeBaseLocationModal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, onPlaceSelect}) => {
  const [address, setAddress] = useState<string>('');

  const [placeAutocomplete, setPlaceAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');

  const handleSave = () => {
    if(localStorage.getItem('homebaseLocation') != address){
        onSave(address);
    }
    onClose();
  };


  useEffect(() => {
      if (!places || !inputRef.current) return;
      const options = {
          componentRestrictions: { country: "us" },
          fields: ["address_components", "geometry", "icon", "name", "place_id",  "adr_address", "formatted_address"],
          strictBounds: false,
      };

      setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
      if (!placeAutocomplete) return;

      placeAutocomplete.addListener('place_changed', () => {
      onPlaceSelect(placeAutocomplete.getPlace());
      });
  }, [onPlaceSelect, placeAutocomplete]);
  
  

  return (
    <div className={`overlay ${isOpen ? 'show' : 'hide'}`}>
      <div className="modal">
        <h2>Enter Address</h2>
        <Input  
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your home base address"
            className="input"
            ref={inputRef}
        />
        <div className="buttons">
          <Button onClick={handleSave} className="button save-button">
            Save
          </Button>
          <Button onClick={onClose} className="button close-button">
            Close
          </Button>
          
        </div>
      </div>
    </div>
  );
};
export default HomeBaseLocationModal;