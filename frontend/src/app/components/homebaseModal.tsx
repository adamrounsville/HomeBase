"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: string) => void;
}

const HomeBaseLocationModal: React.FC<ModalProps> = ({ isOpen, onClose, onSave }) => {
  const [address, setAddress] = useState<string>('');

  const handleSave = () => {
    if(localStorage.getItem('homebaseLocation') != address){
        onSave(address);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="overlay">
      <div className="modal">
        <h2>Enter Address</h2>
        <Input  
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your home base address"
            className="input"
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