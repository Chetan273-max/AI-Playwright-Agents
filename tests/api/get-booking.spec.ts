import { test, expect } from '../../fixtures';

test('GET /booking/1 returns booking details', async ({ request }) => {
  const response = await request.get('https://restful-booker.herokuapp.com/booking/1');
  expect(response.status()).toBe(200);

  const booking = await response.json();
  /*
  expect(booking).toEqual(
    expect.objectContaining({
      firstname: expect.any(String),
      lastname: expect.any(String),
      totalprice: expect.any(Number),
      depositpaid: expect.any(Boolean),
      bookingdates: expect.objectContaining({
        checkin: expect.any(String),
        checkout: expect.any(String),
      }),
      additionalneeds: expect.any(String),
    }),
  );
*/
  expect(booking.firstname).not.toBe("")
  expect(booking.totalprice).toBeGreaterThan(0)
  expect(booking.depositpaid).toBe(false)

});


