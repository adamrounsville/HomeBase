import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Homebase = () => {
 
    const HomebaseInput = () => {
        return (
            <Input className='homebase-input'/>
        );
    };

    const EditButton = () => {
        return (
            <Button className = "edit-button" type="submit">
                <i className="fas fa-edit"></i>
            </Button>
        );
    };

    return(
        <div className='homebase-section'>
            <HomebaseInput/>
            <EditButton/>
        </div>
        
    );

};
  

export default  Homebase;