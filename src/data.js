export const enrolmentcenters = [
    {
        countryCode: "DE",     
        name: "Enrolment Centre, Frankfurt, Germany",
        address: "Frankfurt Airport, Abflugring Terminal 1 Bereich B, Frankfurt, 60547",
        phone: "06969026237",
        email: "info@ficoven.com",
        time: "09:30 AM - 06:30 PM",
        days: "Mon, Tues, Wed, Thur, Fri"

    }, 

    {
        countryCode: "GB",
        name: "Bristol Enrolment Centre, UK",
        address: "11 Snowberry Walk BRISTOL Bristol, Bristol, BS5 7DG",
        phone: "07984692560",
        email: "info@ficoven.com",
        time: "09:30 AM - 06:30 PM",
        days: "Mon, Tues, Wed, Thur, Fri"
    },

    {
        countryCode: "GB",
        name: "South East London Enrolment Centre, UK",
        address: "Unit 18, 71/73 Nathan Way London, United Kingdom, SE28 0BQ",
        phone: "070 2018 9053",
        email: "info@ficoven.com",
        time: "09:30 AM - 05:00 PM",
        days: "Mon, Tues, Wed, Thur, Fri"
    }
]

export const dashboardItems = [
    {
        name: "Bookings",
        link: "/bookings",
        subTitle: "View all bookings",
        isModerator: true
    },
    {
        name: "Services",
        link: "/services",
        subTitle: "View all services",
        isModerator: true
    },
    {
        name: "Admin Users",
        link: "/users",
        subTitle: "View all admin users",
        isModerator: false

    },
    {
        name: "Enrolment Centers",
        link: "/enrolment-centers",
        subTitle: "View all centers",
        isModerator: true
    },
    {
        name: "Payments",
        link: "/payments",
        subTitle: "View all payments",
        isModerator: true
    },
    {
        name: "Profile",
        link: "/profile",
        subTitle: "View your profile",
        isModerator: true
    },
    {
        name: "Add Service",
        link: "/add-service",
        subTitle: "Add a service",
        isModerator: false
    },
    {
        name: "Add Enrolment Center",
        link: "/add-center",
        subTitle: "Add a center",
        isModerator: false
    },
    {
        name: "Add Admin",
        link: "/register",
        subTitle: "Add an Administrator",
        isModerator: false
    }
]

export const dashboardModeItems = [
    {
        name: "Bookings",
        link: "/bookings",
        subTitle: "View all bookings",
        isModerator: true
    },
    {
        name: "Services",
        link: "/services",
        subTitle: "View all services",
        isModerator: true
    },
    
    {
        name: "Enrolment Centers",
        link: "/enrolment-centers",
        subTitle: "View all centers",
        isModerator: true
    },
    {
        name: "Payments",
        link: "/payments",
        subTitle: "View all payments",
        isModerator: true
    },
    {
        name: "Profile",
        link: "/profile",
        subTitle: "View your profile",
        isModerator: true
    },
]

export const allowedTimes = ["9:00 am","9:15 am", "9:30 am", "9:45 am", "10:00 am", "10:15 am",
"10:30 am", "10:45 am", "11:00 am", "11:15 am", "11:30 am", "11:45 am", "12:00 pm",
"12:15 pm", "12:30 pm", "12:45 pm", "1:00 pm", "1:15 pm", "1:30 pm", "1:45 pm", "2:00 pm",
"2:15 pm","2:30 pm", "2:45 pm","3:00 pm","3:15 pm","3:30 pm","3:45 pm","4:00 pm", "4:15 pm",
"4:30 pm", "4:45 pm"]

export const allowedStatus = ["Pending", "Booked", "Cancelled", "Rejected"];