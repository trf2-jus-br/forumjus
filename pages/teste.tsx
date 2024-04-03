import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { usarContexto } from '../contexto';

const qrCodeConstraints : MediaTrackConstraints = { 
  facingMode: "environment",
  aspectRatio: 1
}

const Test = (props) => {
  const { api } = usarContexto();

  async function registarEntrada(qrCode : string){
    if(!qrCode)
      return;

    const partes = qrCode.split('/');
    const token = partes[partes.length - 1];

    try{
      await api.post('/api/presenca', { token});
      window.location.href = '/presenca';
    }catch(err){

    }
  }


  return (
    <>
      <QrReader
        constraints={qrCodeConstraints}
        onResult={(result, error) => registarEntrada(result?.text)}
        style={{ width: '100%' }}
      />
    </>
  );
};

export default Test;