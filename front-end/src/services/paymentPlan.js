import { createPaymentToPlan } from "./api"


export default function CreatePayments(typePlan, router) {

 if(typePlan === "Plano Básico") {
    createPaymentToPlan("basic")
        .then((res)=>{
            const mercadoPago = res.data?.point_of_interaction?.transaction_data?.ticket_url
            router.push(mercadoPago) 
        })
        .catch((err=> {
            console.log(err.message)
            if(err.message === "Request failed with status code 304"){
                alert("Você já tem esse plano")
            }
            if(err.message === "Request failed with status code 401"){
                router.push('/auth-login')
            }
        }))

  } else if (typePlan === "Plano Premium") {
    createPaymentToPlan("premium")
    .then((res)=>{
        const mercadoPago = res.data?.point_of_interaction?.transaction_data?.ticket_url
        router.push(mercadoPago)
    })
    .catch((err=> {
        console.log(err.message)
        if(err.message === "Request failed with status code 304"){
            alert("Você já tem esse plano")
        }
        if(err.message === "Request failed with status code 401"){
            router.push('/auth-login')
        }
    }))
  } else if (typePlan === "Plano Mega Rifa") {
    createPaymentToPlan("master")
    .then((res)=>{
        const mercadoPago = res.data?.point_of_interaction?.transaction_data?.ticket_url
        router.push(mercadoPago)
    })
    .catch((err=> {
        console.log(err.message)
        if(err.message === "Request failed with status code 304"){
            alert("Você já tem esse plano")
        }
        if(err.message === "Request failed with status code 401"){
            router.push('/auth-login')
        }
    }))
  } else if (typePlan === "Plano Teste") {
    router.push('/sign-up');
  }

  return null;
}
