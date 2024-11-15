"use client"
import React, { useEffect, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import HomeBaseLocationModal from './homebaseModal';
import { Place } from '@/lib/utils';

interface Props {
  homebaseLocation: Place | null;
  onHomebaseSelect: (place: Place | null) => void;
  setFocusHomebase: (focusHomebase: boolean) => void;
}

const Homebase = ({ onHomebaseSelect: onHomebaseSelect, homebaseLocation, setFocusHomebase }: Props) => {
  const [homebaseAddress, setHomebaseAddress] = useState<string>("")
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const homebaseLocation = localStorage.getItem('homebaseLocation');
    if (homebaseLocation != null) {
      setHomebaseAddress(homebaseLocation);
    } else {
      setHomebaseAddress("Enter the address of your HomeBase!")
    }

    if (!homebaseLocation) {
      setIsModalOpen(true);
    }
  }, []);

  const handleSave = () => {
    if (homebaseLocation) {
      localStorage.setItem('homebaseLocation', homebaseLocation.address!);
      const latitude = homebaseLocation.latitude;
      const longitude = homebaseLocation.longitude
      localStorage.setItem('homebasePositionLat', latitude!.toString());
      localStorage.setItem('homebasePositionLng', longitude!.toString());
      localStorage.setItem('homebaseName', homebaseLocation.name!);
      localStorage.setItem('homebaseID', homebaseLocation.placeId!);
      const viewport = JSON.stringify(homebaseLocation.viewport.toJSON())
      localStorage.setItem('homebaseViewport', viewport!)
      setHomebaseAddress(homebaseLocation.address!);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFocusRequest = () => {
    setFocusHomebase(true);
  };

 
  const HomebaseInput = () => {
      return (
          <Input 
              className='homebase-input'
              value={homebaseAddress}
              readOnly 
          />


      );
  };

    const EditButton = () => {
        return (
            <Button 
                className = " button-hover-effect edit-button" 
                type="submit"
                onClick={openModal}
                >
                <i className="fas fa-edit"></i>
            </Button>
        );
    };

    return(
        <div className='homebase-section'>
            <h2 className='homebase-title'>Homebase:</h2>
            <HomebaseInput/>
            <EditButton/>
            <Button 
                className = "button-hover-effect edit-button" 
                type="submit"
                onClick={handleFocusRequest}
                >
                <i className="fas fa-home"></i>
            </Button>
            <HomeBaseLocationModal 
                isOpen={isModalOpen} 
                onClose={closeModal} 
                onSave={handleSave}
                onPlaceSelect={onHomebaseSelect}
                
            />
        </div>
        
    );
  }
export default Homebase;
