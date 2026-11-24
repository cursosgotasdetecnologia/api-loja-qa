import { test, expect } from '@playwright/test';
import 'dotenv/config';


test.describe('Consulta Clientes com Token Existente', () => {

  let token: string;
  
  test.beforeEach(async ({ request }) => {
    const tokenResponse = await request.post('/api/v1/token');

    expect(tokenResponse.ok()).toBe(true);

    const tokenBody = await tokenResponse.json();
    token = tokenBody.data.token;
  });



  test('Consultar cliente existente', async ({ request }) => {

    const response = await request.get(`/api/v1/clientes/1`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    expect(response.status()).toBe(200);

  });


  test('Consultar cliente inexistente', async ({ request }) => {

    const clienteId = 1112;

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

  test('Consultar cliente com ID inválido', async ({ request }) => {
    const clienteId = 'abc';

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

test.describe('Consulta de clientes sem Token', () => {

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

});