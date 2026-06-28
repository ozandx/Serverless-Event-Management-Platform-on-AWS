// =========================
// MOBILE MENU
// =========================

const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

if (menuBtn) {
    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
}

// =========================
// COUNTER
// =========================

document.querySelectorAll(".counter").forEach(counter => {

    const target = Number(counter.dataset.target);
    let current = 0;

    const update = () => {

        const increment = Math.ceil(target / 100);

        if (current < target) {

            current += increment;

            if (current > target)
                current = target;

            counter.textContent = current;

            requestAnimationFrame(update);
        }

    };

    update();

});

// =========================
// API URL
// =========================

const API_BASE =
"https://cvqujh7rse.execute-api.us-east-1.amazonaws.com/prod";

const CREATE_EVENT_URL = `${API_BASE}/create-event`;
const SUBSCRIBE_URL = `${API_BASE}/subscribe`;

// =========================
// CONTACT FORM
// =========================

const form = document.getElementById("contactForm");

if (form) {

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const button = form.querySelector("button");

        button.disabled = true;
        button.textContent = "Sending...";

        const payload = {

            name: document.getElementById("name").value.trim(),
            email: document.getElementById("email").value.trim(),
            message: document.getElementById("message").value.trim(),
            createdAt: new Date().toISOString()

        };

        console.log("Sending", payload);

        try {

            // ----------------------------
            // Register Event
            // ----------------------------

            const eventResponse = await fetch(CREATE_EVENT_URL, {

                method: "POST",

                mode: "cors",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(payload)

            });

            if (!eventResponse.ok) {

                throw new Error(await eventResponse.text());

            }

            console.log(await eventResponse.json());

            // ----------------------------
            // Subscribe
            // ----------------------------

            const subscribeResponse = await fetch(SUBSCRIBE_URL, {

                method: "POST",

                mode: "cors",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: payload.email
                })

            });

            if (!subscribeResponse.ok) {

                throw new Error(await subscribeResponse.text());

            }

            console.log(await subscribeResponse.json());

            alert("Message sent successfully!");

            form.reset();

        }

        catch (err) {

            console.error(err);

            alert(err.message);

        }

        finally {

            button.disabled = false;
            button.textContent = "Submit";

        }

    });

}