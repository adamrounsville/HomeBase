"use client"
import React, { useEffect, useRef, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import HomeBaseLocationModal from './homebaseModal';

interface Props {
    homebaseLocation: google.maps.places.PlaceResult | null;
    onHomebaseSelect: (place: google.maps.places.PlaceResult | null) => void;
  }

const Homebase = ({onHomebaseSelect: onHomebaseSelect, homebaseLocation}: Props) => {
    const [homebaseAddress, setHomebaseAddress] = useState<string>("")
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);


    useEffect(() => {
        const homebaseLocation = localStorage.getItem('homebaseLocation');
        if(homebaseLocation != null){
            setHomebaseAddress(homebaseLocation);
        }
        else{
            setHomebaseAddress("Enter the address of your HomeBase!")
        }

        if (!homebaseLocation) {
            setIsModalOpen(true);
        }
    }, []);

    const handleSave = () => {
        if(homebaseLocation){
            localStorage.setItem('homebaseLocation', homebaseLocation.formatted_address!);
            const latitude = homebaseLocation.geometry!.location!.lat();
            const longitude = homebaseLocation.geometry!.location!.lng();
            localStorage.setItem('homebasePositionLat', latitude.toString());
            localStorage.setItem('homebasePositionLng', longitude.toString());
            localStorage.setItem('homebaseName', homebaseLocation.name!);
            localStorage.setItem('homebaseID', homebaseLocation.place_id!);
            setHomebaseAddress(homebaseLocation?.formatted_address!);
        }
        
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
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
                className = "edit-button" 
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
            <HomeBaseLocationModal 
                isOpen={isModalOpen} 
                onClose={closeModal} 
                onSave={handleSave}
                onPlaceSelect={onHomebaseSelect}
                
            />
        </div>
        
    );

};

export default  Homebase;