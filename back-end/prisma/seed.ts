import { prisma } from "../src/config";

async function main(){
    await prisma.plans.createMany({
        data: [
        {   
            name: "Pacote Teste",
            description: "Só paga quando conseguir vender todas as cotas ou sua rifa expirar. Basta se cadastrar e você já terá acesso ao Plano Teste :)",
            max_campaigns: 1,
            max_tickets: 100,
            campaign_duration: 45,
            custom_page: false,
            support_email: true,
            support_phone: false,
            support_chat: false,
            priority_promotion: false,
            custom_dashboard: false,
            custom_logo: false,
            price: 9.99
        },
        {
            name: "Pacote Básico",
            description: "O Plano Básico é uma opção acessível e funcional para iniciantes que desejam explorar o potencial de vendas em suas campanhas. É uma escolha econômica com recursos adequados para uma operação inicial.",
            max_campaigns: 3,
            max_tickets: 1000,
            campaign_duration: 60,
            custom_page: false,
            support_email: true,
            support_phone: false,
            support_chat: false,
            priority_promotion: false,
            custom_dashboard: false,
            custom_logo: false,
            price: 19.99
        },
        {
            name: "Pacote Premium",
            description: "O Plano Premium é uma opção avançada e completa para aqueles que desejam maximizar o sucesso de suas campanhas com recursos robustos.",
            max_campaigns: 10,
            max_tickets: 15000,
            campaign_duration: 60,
            custom_page: true,
            support_email: true,
            support_phone: true,
            support_chat: false,
            priority_promotion: true,
            custom_dashboard: true,
            custom_logo: true,
            price: 29.90
        },
        {
            name: "Pacote Mega Rifa",
            description: "O Plano Mega Rifa é especialmente projetado para atender ONGs ou Pessoas que desejam realizar rifas em larga escala com recursos avançados.",
            max_campaigns: 20,
            max_tickets: 999999,
            campaign_duration: 90,
            custom_page: true,
            support_email: true,
            support_phone: true,
            support_chat: true,
            priority_promotion: true,
            custom_dashboard: true,
            custom_logo: true,
            price: 39.90
        }
    ]
    })
}

main()
    .then(()=>{
        console.log("Registro de planos feito com sucesso!")
    })
    .catch(e =>{
        console.error(e);
        process.exit(1);
    })
    .finally(async ()=>{
        await prisma.$disconnect();
    })