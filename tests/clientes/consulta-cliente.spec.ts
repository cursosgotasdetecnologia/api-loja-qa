import { test, expect } from '@playwright/test';
import 'dotenv/config';


test.describe('Consulta de clientes por identificador', () => {


  test('Consultar cliente existente', async ({ request }) => {

    //const clienteId = 1;
    //const nomeEsperado = 'Ana Paula Martins';
    //const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJsb2phLXFhLWFwaSIsImF1ZCI6ImxvamEtcWEtcHJhdGljYSIsInN1YiI6InByYXRpY2EiLCJpYXQiOjE3OTU0NjEwMTgsImV4cCI6MTc5NTQ4OTgxOCwianRpIjoiMDRmZDA1MzctYTAxYy00NDg3LWEwNmMtZjg1OTNjODFlZDgwIn0.NFmJhIey_nZBeNW76HKq_Hvg6WxAG4MgAAcG0ctCW-0';

    const token = process.env.API_TOKEN;

    if (!token) {
      throw new Error('Preencha API_TOKEN no arquivo .env.');
    }


    const response = await request.get(`/api/v1/clientes/1`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    expect(response.status()).toBe(200);

  });

  test('Consultar cliente inexistente', async ({ request }) => {

    const clienteId = 1112;
    //const nomeEsperado = 'Ana Paula Martins';
    //const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJsb2phLXFhLWFwaSIsImF1ZCI6ImxvamEtcWEtcHJhdGljYSIsInN1YiI6InByYXRpY2EiLCJpYXQiOjE3OTU0NjEwMTgsImV4cCI6MTc5NTQ4OTgxOCwianRpIjoiMDRmZDA1MzctYTAxYy00NDg3LWEwNmMtZjg1OTNjODFlZDgwIn0.NFmJhIey_nZBeNW76HKq_Hvg6WxAG4MgAAcG0ctCW-0';

    const token = process.env.API_TOKEN;

    if (!token) {
      throw new Error('Preencha API_TOKEN no arquivo .env.');
    }

    const response = await request.get(`/api/v1/clientes/${clienteId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    expect(response.status()).toBe(404);

    const body = await response.json();

    expect(body.data).toBeNull();

    expect(body.mensagens).toHaveLength(1);
    expect(body.mensagens[0].codigo).toBe('RESOURCE_NOT_FOUND');
    expect(body.mensagens[0].texto).toBe('Registro não encontrado.');
  });

  test('Consultar cliente sem token', async ({ request }) => {
    const response = await request.get('/api/v1/clientes/1');

    expect(response.status()).toBe(401);

    const body = await response.json();

    expect(body.data).toBeNull();
    expect(body.mensagens).toHaveLength(1);
    expect(body.mensagens[0].codigo).toBe('AUTH_TOKEN_MISSING');
    expect(body.mensagens[0].texto).toBe(
      'Token de acesso não informado. Envie o header Authorization: Bearer <token>.'
    );
  });

  test('Consultar cliente com token inválido', async ({ request }) => {
    const response = await request.get('/api/v1/clientes/1', {
      headers: {
        Authorization: 'Bearer token-invalido'
      }
    });

    expect(response.status()).toBe(401);

    const body = await response.json();

    expect(body.data).toBeNull();
    expect(body.mensagens).toHaveLength(1);
    expect(body.mensagens[0].codigo).toBe('AUTH_TOKEN_INVALID');
    expect(body.mensagens[0].texto).toBe('Token de acesso inválido.');
  });

  test('Consultar cliente com ID inválido', async ({ request }) => {
    const clienteId = 'abc';
    const token = process.env.API_TOKEN;

    if (!token) {
      throw new Error('Preencha API_TOKEN no arquivo .env.');
    }

    const response = await request.get(`/api/v1/clientes/${clienteId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.data).toBeNull();
    expect(body.mensagens).toHaveLength(1);
    expect(body.mensagens[0].codigo).toBe('REQUEST_INVALID');
    expect(body.mensagens[0].texto).toBe(
      'ID deve ser um inteiro positivo de até 2147483647.'
    );
  });


});