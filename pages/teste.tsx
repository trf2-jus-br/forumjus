import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';

const Test = (props) => {
  const [data, setData] = useState('No result');

  return (
    <>
      <QrReader
        key="environment"
        constraints={{
          facingMode: "environment"
        }}
        onResult={(result, error) => {
          if (!!result) {
            setData(result?.text);
          }
        }}
        style={{ width: '100%' }}
      />
      <p>{data}</p>
    </>
  );
};

export default Test;