<script>
    import { user, pet, URL } from "$lib/stores";
    import { goto } from "$app/navigation";
    import axios from "axios";

    import availableVaccines from "$lib/data/vaccine";

    export let appointment;
    $: id = appointment?._id;
    $: appointmentDate = new Date(appointment?.date_time);
    $: day = appointmentDate?.toLocaleDateString([], { day: "numeric" });
    $: month = appointmentDate?.toLocaleDateString([], { month: "long" });
    $: time = appointmentDate?.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    });
    $: clinic = appointment?.clinic_name;
    $: doctor = appointment?.doctor_name;
    $: vaccines = appointment?.vaccines;
    $: location = { ...appointment?.location };
    $: isCompleted = appointment?.completed;
    export let status;

    async function markAsDone(req) {
        axios
            .patch($URL + "/appointments/" + id, req, {
                headers: {
                    authentication: `Bearer ${sessionStorage.getItem(
                        "user-token"
                    )}`,
                },
            })
            .then((res) => console.log("markasdone response", res))
            .catch((err) => {
                console.log(err);
            });
    }
</script>

<div class="VaccineDetailCard">
    <span class={"Date " + (appointment?.completed ? "Completed" : status)}>
        <h1>{day == "Invalid Date"?"Loading":day}</h1>
        <h4>{month.toUpperCase() == "INVALID DATE"?"":month.toUpperCase()}</h4>
    </span>
    <span class="CardContentArea">
        <div>
            <h4>{clinic}</h4>
            <p>{time}</p>
        </div>
        <p>{doctor}</p>
        {#if vaccines != undefined}
            <h4>{vaccines.join(", ")}</h4>
        {/if}
        <h5
            class={(status != "Next"
                ? status
                : isCompleted
                ? "Completed"
                : "Next") + "Text"}
        >
            {(isCompleted ? "Completed" : status) + " Appointment"}
        </h5>
        <div>
            <a
                href={"http://maps.google.com/maps?z=12&t=m&q=loc:" +
                    location?.latitude +
                    "+" +
                    location?.longitude}
                target="_blank"
                class="MapButton"
            >
                <!-- svelte-ignore a11y-missing-attribute -->
                <img src={"/direction-icon.svg"} />
                <h4>Open in Maps</h4>
            </a>
            <button
                class="EditButton"
                on:click={() => goto(`/vaccine/addVaccineSchedule/${id}`)}
            >
                <!-- svelte-ignore a11y-missing-attribute -->
                <img src={"/edit-icon-green.svg"} />
            </button>
        </div>
        {#if !isCompleted}
            <button
                class={"DoneButton"}
                on:click={() => {
                    let req = {
                        completed: true,
                        petId: $pet
                    };
                    markAsDone(req);
                    status = "Completed";

                    // auto generate appointments based on vaccines

                    // if (!vaccines || vaccines.length != 0) {
                    //     console.log("vaccines of this appt:", vaccines);
                    //     vaccines.forEach((vax) => {
                    //         let v = availableVaccines.filter(
                    //             (vac) => vac.name == vax
                    //         )[0];
                    //         if (
                    //             v != undefined &&
                    //             v.maxDoses > appointment.doseNo
                    //         ) {
                    //             // create new appointment
                    //             let apts = $user.pets[$pet].appointments;
                    //             let newDate = new Date(appointmentDate);
                    //             newDate.setDate(newDate.getDate() + v.gap);
                    //             apts.push();
                    //             {
                    //                 date_time: newDate.toLocaleString(),
                    //                 clinic_name: clinic,
                    //                 doctor_name: doctor,
                    //                 vaccines: [vax],
                    //                 doseNo: appointment.doseNo + 1,
                    //                 completed: false,
                    //                 location: { ...appointment.location },
                    //             }
                    //         }
                    //     });
                    // }
                }}
            >
                <!-- svelte-ignore a11y-missing-attribute -->
                <img src={"/tick-icon-yellow.svg"} />

                <h4>{"Mark as done"}</h4>
            </button>
        {/if}
    </span>
</div>

<style>
    .VaccineDetailCard {
        border-radius: var(--radius-large);
        border: solid 1px var(--color-border);
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .Date {
        border-radius: var(--radius-small);
        border: solid 1px var(--color-border);
        min-height: 6rem;
        /* background-color: var(--color-disabled); */
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        height: min-content;
    }
    .Date {
        font-size: var(--font-huge);
        font-weight: 500;
        /* margin-top: 0.6rem; */
    }

    .Next {
        background-color: var(--color-disabled);
        color: #000000;
    }
    .Upcoming {
        background-color: var(--color-request);
        color: #ffffff;
    }
    .Missed {
        background-color: #1b1b1b;
        color: #ffffff;
    }
    .MissedText {
        color: red;
    }
    .Completed {
        background-color: #b7b7b7;
        color: #ffffff;
    }
    .CompletedText {
        color: green;
    }

    .CardContentArea {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }
    .CardContentArea > div > h4::before {
        content: "at ";
        font-weight: 300;
    }
    .CardContentArea > div > h4 {
        font-size: var(--font-xl);
        font-weight: 700;
    }
    .CardContentArea > p::before {
        content: "with ";
        font-weight: 300;
    }
    .CardContentArea > p {
        font-size: var(--font-l);
        font-weight: 500;
        margin: 0;
        padding: 0;
    }
    .CardContentArea > h5::before {
        content: "Status ";
        font-size: var(--font-l);
        font-weight: 300;
    }
    .CardContentArea > h4::before {
        content: "Vaccine ";
        font-size: var(--font-l);
        font-weight: 300;
    }
    .CardContentArea > h4 {
        font-size: var(--font-xl);
        font-weight: 500;
    }
    .CardContentArea > div {
        flex-grow: 1;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
    }
    .CardContentArea > div > p {
        font-style: italic;
        font-size: var(--font-m);
        font-weight: 500;
    }
    .CardContentArea > div > button {
        border: solid 1px #000000;
        border-radius: 1.1rem;
        height: 2.2rem;
        margin-bottom: 0.75rem;
        margin-top: 0.75rem;
    }
    .CardContentArea > div > a {
        border: solid 1px #000000;
        border-radius: 1.1rem;
        height: 2.2rem;
        margin-bottom: 0.75rem;
        margin-top: 0.75rem;
    }
    .MapButton {
        width: 45%;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
    }
    .DoneButton {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
    }
    .EditButton {
        padding: 0.2rem;
        height: 2.2rem;
        width: 2.2rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .Disabled {
        opacity: 75%;
        cursor: disabled;
    }
    .CardContentArea > button {
        border: solid 1px #000000;
        border-radius: 1.1rem;
        height: 2.2rem;
        background-color: var(--color-enabled);
    }
</style>
