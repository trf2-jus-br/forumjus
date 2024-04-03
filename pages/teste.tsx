import React, { useEffect, useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { usarContexto } from '../contexto';

const qrCodeConstraints : MediaTrackConstraints = { 
  facingMode: "environment",
  aspectRatio: 1
}

const Test = (props) => {
  const [qrCode, setQrCode] = useState<string>(null);

  const { api } = usarContexto();

  async function registarEntrada(){
    if(!qrCode)
      return;

    const partes = qrCode.split('/');
    const token = partes[partes.length - 1];

    try{
      await api.post('/api/presenca', { token});
      window.location.href = '/presenca';
    }catch(err){

    } finally {
    }
  }

  useEffect(()=>{
    registarEntrada();
  }, [qrCode])

  return (!qrCode && <>
      <QrReader
        constraints={qrCodeConstraints}
        onResult={(result, error) => setQrCode(result?.text)}
        style={{ width: '100%' }}
      />
    </>
  );
};

export default Test;