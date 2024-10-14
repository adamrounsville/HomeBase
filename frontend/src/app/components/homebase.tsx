"use client"
import React, { useEffect, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import HomeBaseLocationModal from './homebaseModal';


const Homebase = () => {
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

    const handleSave = (address: string) => {
        localStorage.setItem('homebaseLocation', address);
        setHomebaseAddress(address);
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
            <h2>Homebase:</h2>
            <HomebaseInput/>
            <EditButton/>
            <HomeBaseLocationModal 
                isOpen={isModalOpen} 
                onClose={closeModal} 
                onSave={handleSave}
            />
        </div>
        
    );

};

export default  Homebase;