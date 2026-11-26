import {test,expect} from '@playwright/test'

test.describe('Api Testing',()=>{

    test(`@functional API_Neg_001:create booking without first name`,async({request})=>{

        const getResponse = await request.get("https://restful-booker.herokuapp.com/booking/1")

        expect(getResponse.status()).toBe(200)
        expect(getResponse.ok()).toBeTruthy()

        const getResponseBody = await getResponse.json()

        console.log(getResponseBody)

     interface BookingDates{
      checkin:string;
      checkout:string
      }        

      interface User{     
      firstname:string;
      lastname:string;
      totalprice:number;
      depositpaid:boolean;
      bookingdates:BookingDates
    }

    const postResponse = await request.post("https://restful-booker.herokuapp.com/booking",{

    data:{
     lastname: 'xyz',
     totalprice: 122,
     depositpaid: false,
     bookingdates: { checkin: '2022-02-15', checkout: '2025-12-29' }
    }
   })

   //const postResponseBody = await postResponse.json()

   //console.log(postResponseBody)
   console.log(postResponse.status())

})

test(`@functional Auth_001:Login with valid credentials`,async({request})=>{

    const response = await request.post("https://restful-booker.herokuapp.com/auth",{
        data:{
            username:"admin",
            password:"password123"
        }
    })
    expect(response.status()).toBe(200)
    const responseBody = await response.json()
    console.log(responseBody)
    const token = responseBody.token
    console.log(token)

    const getResponse = await request.get("https://restful-booker.herokuapp.com/booking/1")

    const getResponseBody = await getResponse.json()

    console.log(getResponseBody)

    const putResponse = await request.put("https://restful-booker.herokuapp.com/booking/1",{
        headers:{
            cookie:`token=${token}`
        },
        data:{
         firstname: 'Chetan',
         lastname: 'xyx',
         totalprice: 100,
         depositpaid: true,
         bookingdates: { checkin: '2022-07-28', checkout: '2025-12-17' }
 }

})

const putResponseBody = await putResponse.json()
console.log(putResponseBody)

expect(putResponse.status()).toBe(200)
expect(putResponse.ok()).toBeTruthy()
expect(putResponseBody.firstname).toBe("Chetan")
expect(putResponseBody).toMatchObject({
         firstname: 'Chetan',
         lastname: 'xyx',
         totalprice: 100,
         depositpaid: true,
         bookingdates: { checkin: '2022-07-28', checkout: '2025-12-17' }
 }
)

})

test(`@functional TC-API-CHAIN-001:Create booking and update booking`,async({request})=>{

    const postResponse = await request.post("https://restful-booker.herokuapp.com/booking",{
        data:{
               firstname: 'Chetan', 
               lastname: 'xyz',
               totalprice: 122,
               depositpaid: false,
               bookingdates: { checkin: '2022-02-15', checkout: '2025-12-29' }
        }
    })

    expect(postResponse.status()).toBe(200)
    const postResponseBody = await postResponse.json()

    console.log(postResponseBody)

    const bookingId = postResponseBody.bookingid

    const getResponse = await request.get(`https://restful-booker.herokuapp.com/booking/${bookingId}`)

    expect(getResponse.status()).toBe(200)

    const getResponseBody = await getResponse.json()

    expect(getResponseBody.firstname).toBe("Chetan")
    expect(getResponseBody.lastname).toBe("xyz")
    expect(getResponseBody.totalprice).toBe(122)   

})

test(`@functional patch booking`,async({request})=>{

    const authResponse = await request.post("https://restful-booker.herokuapp.com/auth",{
        data:{
            username:"admin",
            password:"password123"
        }
    })

    const authResponseBody = await authResponse.json()
    const token = authResponseBody.token

    const postResponse = await request.post("https://restful-booker.herokuapp.com/booking",{
        data:{
               firstname: 'Ericsson', 
               lastname: 'Jio',
               totalprice: 121,
               depositpaid: true,
               bookingdates: { checkin: '2026-02-15', checkout: '2026-12-29' }
        }
    })

    const postresponseBody = await postResponse.json()
    expect(postResponse.status()).toBe(200)

    const bookingId = postresponseBody.bookingid

    const patchResponse = await request.patch(`https://restful-booker.herokuapp.com/booking/${bookingId}`,{
        headers:{
            cookie:`token=${token}`
        },
        data:{
            firstname: 'updated Ericsson'
        }
    })

    const patchResponseBody = await patchResponse.json()

    expect(patchResponse.status()).toBe(200)
    expect(patchResponseBody.firstname).toBe("updated Ericsson")
    expect(patchResponseBody.lastname).toBe("Jio")
    expect(patchResponseBody.totalprice).toBe(121)

})
})