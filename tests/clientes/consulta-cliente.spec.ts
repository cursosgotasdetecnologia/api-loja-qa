import {test, expect } from '@playwright/test';

test('Consultar cliente existente',async ({request}) => {

    //const clienteId = 1;
    //const nomeEsperado = 'Ana Paula Martins';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJsb2phLXFhLWFwaSIsImF1ZCI6ImxvamEtcWEtcHJhdGljYSIsInN1YiI6InByYXRpY2EiLCJpYXQiOjE3OTU0NjEwMTgsImV4cCI6MTc5NTQ4OTgxOCwianRpIjoiMDRmZDA1MzctYTAxYy00NDg3LWEwNmMtZjg1OTNjODFlZDgwIn0.NFmJhIey_nZBeNW76HKq_Hvg6WxAG4MgAAcG0ctCW-0';

    const response = await request.get(`/api/v1/clientes/1`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

     expect(response.status()).toBe(200);
   

});