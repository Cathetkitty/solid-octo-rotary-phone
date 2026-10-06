/* =========================================================
   PorkyPal - script.js
   Healthy Pigs, Happy Tomorrow
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* -------------------------------------------------------
     APP STATE
  ------------------------------------------------------- */

  const defaultState = {
    currentPage: "home",

    farm: {
      name: "Happy Farm",
      location: "Davao, Philippines"
    },

    pigs: [
      {
        id: 1,
        name: "Lily",
        breed: "Large White",
        gender: "Female",
        status: "Pregnant",
        weight: 132,
        height: 45,
        age: "3 months",
        dueDate: "Aug 30, 2025",
        notes: "Good appetite and active.",
        image: "images/lily.jpg"
      },
      {
        id: 2,
        name: "Bella",
        breed: "Landrace",
        gender: "Female",
        status: "Pregnant",
        weight: 120,
        height: 43,
        age: "4 months",
        dueDate: "Sep 6, 2025",
        notes: "Healthy and active.",
        image: "images/bella.jpg"
      },
      {
        id: 3,
        name: "Rose",
        breed: "Duroc",
        gender: "Female",
        status: "Pregnant",
        weight: 125,
        height: 44,
        age: "4 months",
        dueDate: "Sep 12, 2025",
        notes: "Growing well.",
        image: "images/rose.jpg"
      },
      {
        id: 4,
        name: "Daisy",
        breed: "Landrace",
        gender: "Female",
        status: "Non-Pregnant",
        weight: 118,
        height: 42,
        age: "3 months",
        dueDate: null,
        notes: "Healthy.",
        image: "images/daisy.jpg"
      },
      {
        id: 5,
        name: "Cookie",
        breed: "Duroc",
        gender: "Female",
        status: "Non-Pregnant",
        weight: 110,
        height: 41,
        age: "3 months",
        dueDate: null,
        notes: "Active and playful.",
        image: "images/cookie.jpg"
      }
    ],

    feeding: [
      {
        id: 1,
        pigId: 1,
        type: "Morning",
        time: "8:00 AM",
        amount: "2.5 kg"
      },
      {
        id: 2,
        pigId: 1,
        type: "Evening",
        time: "5:00 PM",
        amount: "2.5 kg"
      }
    ],

    inventory: [
      {
        name: "Grower Feed",
        quantity: 25,
        unit: "kg",
        color: "#8bd17c"
      },
      {
        name: "Grower Feed",
        quantity: 15,
        unit: "kg",
        color: "#f5aa55"
      },
      {
        name: "Starter Feed",
        quantity: 10,
        unit: "kg",
        color: "#c982e8"
      }
    ],

    healthRecords: [
      {
        id: 1,
        pigId: 1,
        type: "Health Check",
        date: "Aug 28, 2025",
        description: "Temperature: 38.5°C",
        status: "Healthy"
      },
      {
        id: 2,
        pigId: 1,
        type: "Vaccination",
        date: "Aug 25, 2025",
        description: "Porcine Circovirus",
        status: "Completed"
      },
      {
        id: 3,
        pigId: 1,
        type: "Deworming",
        date: "Aug 20, 2025",
        description: "Routine deworming",
        status: "Completed"
      }
    ],

    events: [
      {
        id: 1,
        date: "2025-08-27",
        title: "Lily",
        description: "Expected Birth",
        type: "birth"
      },
      {
        id: 2,
        date: "2025-08-30",
        title: "Bella",
        description: "Expected Birth",
        type: "birth"
      },
      {
        id: 3,
        date: "2025-09-06",
        title: "Rose",
        description: "Birth Alert",
        type: "alert"
      }
    ]
  };

  let state = loadState();

  /* -------------------------------------------------------
     LOCAL STORAGE
  ------------------------------------------------------- */

  function loadState() {
    try {
      const saved = localStorage.getItem("porkyPalState");

      if (saved) {
        return {
          ...defaultState,
          ...JSON.parse(saved)
        };
      }
    } catch (error) {
      console.warn("Could not load PorkyPal data:", error);
    }

    return structuredClone(defaultState);
  }

  function saveState() {
    localStorage.setItem("porkyPalState", JSON.stringify(state));
  }

  /* -------------------------------------------------------
     HELPERS
  ------------------------------------------------------- */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  function generateId(items) {
    return items.length
      ? Math.max(...items.map(item => Number(item.id) || 0)) + 1
      : 1;
  }

  function escapeHTML(value) {
    if (value === null || value === undefined) return "";

    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function showToast(message, type = "success") {
    let toast = $(".toast");

    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.className = `toast toast-${type}`;

    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  }

  function formatDate(date) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }).format(new Date(date));
  }

  /* -------------------------------------------------------
     PAGE NAVIGATION
  ------------------------------------------------------- */

  function navigate(page) {
    state.currentPage = page;
    saveState();

    $$(".page").forEach(section => {
      section.classList.toggle(
        "active",
        section.dataset.page === page
      );
    });

    $$(".nav-item").forEach(item => {
      item.classList.toggle(
        "active",
        item.dataset.page === page
      );
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    renderPage(page);
  }

  function renderPage(page) {
    switch (page) {
      case "home":
        renderDashboard();
        break;

      case "pigs":
        renderPigs();
        break;

      case "calendar":
        renderCalendar();
        break;

      case "feeding":
        renderFeeding();
        break;

      case "health":
        renderHealth();
        break;

      case "profile":
        renderProfile();
        break;
    }
  }

  /* -------------------------------------------------------
     DASHBOARD
  ------------------------------------------------------- */

  function renderDashboard() {
    const totalPigs = state.pigs.length;

    const pregnant = state.pigs.filter(
      pig => pig.status === "Pregnant"
    ).length;

    const upcoming = state.events.filter(event => {
      return new Date(event.date) >= new Date();
    }).length;

    setText("[data-total-pigs]", totalPigs);
    setText("[data-pregnant-pigs]", pregnant);
    setText("[data-upcoming-events]", upcoming);
  }

  function setText(selector, value) {
    $$(selector).forEach(element => {
      element.textContent = value;
    });
  }

  /* -------------------------------------------------------
     PIGS
  ------------------------------------------------------- */

  function renderPigs() {
    const container = $("[data-pig-list]");

    if (!container) return;

    const filter = $("[data-pig-filter]")?.value || "all";
    const search = (
      $("[data-pig-search]")?.value || ""
    ).toLowerCase();

    let pigs = [...state.pigs];

    if (filter !== "all") {
      pigs = pigs.filter(
        pig => pig.status.toLowerCase() === filter
      );
    }

    if (search) {
      pigs = pigs.filter(pig =>
        `${pig.name} ${pig.breed}`
          .toLowerCase()
          .includes(search)
      );
    }

    container.innerHTML = pigs.map(pig => `
      <article class="pig-card" data-pig-id="${pig.id}">
        <div class="pig-image">
          <img
            src="${escapeHTML(pig.image)}"
            alt="${escapeHTML(pig.name)}"
            onerror="this.style.display='none'"
          >
        </div>

        <div class="pig-info">
          <h3>${escapeHTML(pig.name)}</h3>

          <p class="pig-breed">
            ${escapeHTML(pig.breed)}
          </p>

          <span class="status-badge ${
            pig.status === "Pregnant"
              ? "pregnant"
              : "normal"
          }">
            ${escapeHTML(pig.status)}
          </span>

          <div class="pig-stats">
            <span>${pig.weight} kg</span>
            <span>${pig.age}</span>
          </div>
        </div>

        <button
          class="view-pig"
          data-action="view-pig"
          data-id="${pig.id}"
          type="button"
        >
          View Details
        </button>
      </article>
    `).join("");
  }

  function showPigDetails(id) {
    const pig = state.pigs.find(
      item => Number(item.id) === Number(id)
    );

    if (!pig) return;

    openModal(`
      <div class="modal-header">
        <h2>${escapeHTML(pig.name)}</h2>
        <button class="modal-close" data-close-modal>&times;</button>
      </div>

      <div class="pig-detail-modal">
        <img
          src="${escapeHTML(pig.image)}"
          alt="${escapeHTML(pig.name)}"
          class="modal-pig-image"
        >

        <span class="status-badge ${
          pig.status === "Pregnant"
            ? "pregnant"
            : "normal"
        }">
          ${escapeHTML(pig.status)}
        </span>

        <div class="detail-grid">
          <div>
            <small>Breed</small>
            <strong>${escapeHTML(pig.breed)}</strong>
          </div>

          <div>
            <small>Weight</small>
            <strong>${pig.weight} kg</strong>
          </div>

          <div>
            <small>Height</small>
            <strong>${pig.height} cm</strong>
          </div>

          <div>
            <small>Age</small>
            <strong>${escapeHTML(pig.age)}</strong>
          </div>

          <div>
            <small>Due Date</small>
            <strong>${pig.dueDate || "N/A"}</strong>
          </div>
        </div>

        <div class="notes">
          <strong>Notes</strong>
          <p>${escapeHTML(pig.notes)}</p>
        </div>

        <div class="modal-actions">
          <button
            class="btn btn-primary"
            data-edit-pig="${pig.id}"
          >
            Edit Pig
          </button>

          <button
            class="btn btn-danger"
            data-delete-pig="${pig.id}"
          >
            Delete
          </button>
        </div>
      </div>
    `);
  }

  /* -------------------------------------------------------
     ADD / EDIT PIG
  ------------------------------------------------------- */

  function showPigForm(pig = null) {
    const editing = Boolean(pig);

    openModal(`
      <div class="modal-header">
        <h2>${editing ? "Edit Pig" : "Add New Pig"}</h2>
        <button class="modal-close" data-close-modal>&times;</button>
      </div>

      <form id="pig-form">

        <label>
          Pig Name
          <input
            type="text"
            name="name"
            required
            value="${editing ? escapeHTML(pig.name) : ""}"
            placeholder="e.g. Daisy"
          >
        </label>

        <label>
          Breed
          <select name="breed">
            ${[
              "Large White",
              "Landrace",
              "Duroc",
              "Hampshire",
              "Berkshire"
            ].map(breed => `
              <option
                value="${breed}"
                ${editing && pig.breed === breed ? "selected" : ""}
              >
                ${breed}
              </option>
            `).join("")}
          </select>
        </label>

        <label>
          Status
          <select name="status">
            <option
              value="Pregnant"
              ${editing && pig.status === "Pregnant" ? "selected" : ""}
            >
              Pregnant
            </option>

            <option
              value="Non-Pregnant"
              ${editing && pig.status === "Non-Pregnant" ? "selected" : ""}
            >
              Non-Pregnant
            </option>
          </select>
        </label>

        <div class="form-row">
          <label>
            Weight (kg)
            <input
              type="number"
              name="weight"
              min="0"
              value="${editing ? pig.weight : ""}"
              required
            >
          </label>

          <label>
            Height (cm)
            <input
              type="number"
              name="height"
              min="0"
              value="${editing ? pig.height : ""}"
              required
            >
          </label>
        </div>

        <label>
          Age
          <input
            type="text"
            name="age"
            value="${editing ? escapeHTML(pig.age) : ""}"
            placeholder="e.g. 3 months"
          >
        </label>

        <label>
          Due Date
          <input
            type="date"
            name="dueDate"
          >
        </label>

        <label>
          Notes
          <textarea name="notes">${editing
            ? escapeHTML(pig.notes)
            : ""}</textarea>
        </label>

        <button class="btn btn-primary full-width" type="submit">
          ${editing ? "Save Changes" : "Add Pig"}
        </button>

      </form>
    `);

    const form = $("#pig-form");

    form.addEventListener("submit", event => {
      event.preventDefault();

      const data = new FormData(form);

      const pigData = {
        name: data.get("name"),
        breed: data.get("breed"),
        status: data.get("status"),
        weight: Number(data.get("weight")),
        height: Number(data.get("height")),
        age: data.get("age"),
        dueDate: data.get("dueDate")
          ? formatDate(data.get("dueDate"))
          : null,
        notes: data.get("notes"),
        image: editing
          ? pig.image
          : "images/default-pig.jpg"
      };

      if (editing) {
        Object.assign(pig, pigData);
        showToast("Pig profile updated!");
      } else {
        pigData.id = generateId(state.pigs);
        state.pigs.push(pigData);
        showToast("New pig added!");
      }

      saveState();
      closeModal();

      renderPigs();
      renderDashboard();
    });
  }

  /* -------------------------------------------------------
     CALENDAR
  ------------------------------------------------------- */

  function renderCalendar() {
    const calendar = $("[data-calendar]");

    if (!calendar) return;

    const today = new Date();
    const year =
      Number(calendar.dataset.year) || today.getFullYear();

    const month =
      Number(calendar.dataset.month ?? today.getMonth());

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDay = firstDay.getDay();

    const monthName = firstDay.toLocaleString("en-US", {
      month: "long"
    });

    const header = calendar.querySelector(
      "[data-calendar-title]"
    );

    if (header) {
      header.textContent = `${monthName} ${year}`;
    }

    const grid = calendar.querySelector(
      "[data-calendar-grid]"
    );

    if (!grid) return;

    let html = "";

    for (let i = 0; i < startDay; i++) {
      html += `<div class="calendar-day empty"></div>`;
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      const events = state.events.filter(
        event => event.date === date
      );

      html += `
        <button
          class="calendar-day ${
            events.length ? "has-event" : ""
          }"
          data-calendar-date="${date}"
        >
          <span>${day}</span>

          ${events.map(event => `
            <small class="calendar-event ${event.type}">
              ${escapeHTML(event.title)}
            </small>
          `).join("")}
        </button>
      `;
    }

    grid.innerHTML = html;
  }

  /* -------------------------------------------------------
     FEEDING
  ------------------------------------------------------- */

  function renderFeeding() {
    const list = $("[data-feeding-list]");

    if (!list) return;

    list.innerHTML = state.feeding.map(feed => {
      const pig = state.pigs.find(
        item => Number(item.id) === Number(feed.pigId)
      );

      return `
        <div class="feeding-item">
          <div>
            <strong>${escapeHTML(feed.type)}</strong>
            <small>
              ${pig ? escapeHTML(pig.name) : "All pigs"}
            </small>
          </div>

          <div>
            <strong>${escapeHTML(feed.time)}</strong>
            <small>${escapeHTML(feed.amount)}</small>
          </div>

          <button
            class="delete-feeding"
            data-delete-feeding="${feed.id}"
            type="button"
          >
            Delete
          </button>
        </div>
      `;
    }).join("");
  }

  function showFeedingForm() {
    openModal(`
      <div class="modal-header">
        <h2>Add Feeding Schedule</h2>
        <button class="modal-close" data-close-modal>&times;</button>
      </div>

      <form id="feeding-form">

        <label>
          Pig
          <select name="pigId">
            <option value="all">All Pigs</option>

            ${state.pigs.map(pig => `
              <option value="${pig.id}">
                ${escapeHTML(pig.name)}
              </option>
            `).join("")}
          </select>
        </label>

        <label>
          Feeding Type
          <select name="type">
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Evening</option>
          </select>
        </label>

        <label>
          Time
          <input type="time" name="time" required>
        </label>

        <label>
          Amount
          <input
            type="text"
            name="amount"
            placeholder="e.g. 2.5 kg"
            required
          >
        </label>

        <button
          type="submit"
          class="btn btn-primary full-width"
        >
          Save Schedule
        </button>

      </form>
    `);

    $("#feeding-form").addEventListener("submit", event => {
      event.preventDefault();

      const data = new FormData(event.target);

      const [hours, minutes] =
        data.get("time").split(":");

      const date = new Date();

      date.setHours(hours, minutes);

      const formattedTime =
        date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit"
        });

      state.feeding.push({
        id: generateId(state.feeding),
        pigId: data.get("pigId") === "all"
          ? null
          : Number(data.get("pigId")),
        type: data.get("type"),
        time: formattedTime,
        amount: data.get("amount")
      });

      saveState();
      closeModal();
      renderFeeding();

      showToast("Feeding schedule saved!");
    });
  }

  /* -------------------------------------------------------
     HEALTH RECORDS
  ------------------------------------------------------- */

  function renderHealth() {
    const list = $("[data-health-list]");

    if (!list) return;

    list.innerHTML = state.healthRecords.map(record => {
      const pig = state.pigs.find(
        item => Number(item.id) === Number(record.pigId)
      );

      return `
        <article class="health-record">
          <div class="health-icon">
            ${getHealthIcon(record.type)}
          </div>

          <div class="health-content">
            <strong>${escapeHTML(record.type)}</strong>

            <small>
              ${escapeHTML(record.date)}
              ${pig ? ` • ${escapeHTML(pig.name)}` : ""}
            </small>

            <p>${escapeHTML(record.description)}</p>
          </div>

          <span class="health-status">
            ${escapeHTML(record.status)}
          </span>
        </article>
      `;
    }).join("");
  }

  function getHealthIcon(type) {
    const icons = {
      "Health Check": "🌡️",
      "Vaccination": "💉",
      "Deworming": "💊",
      "Checkup": "🩺"
    };

    return icons[type] || "❤️";
  }

  function showHealthForm() {
    openModal(`
      <div class="modal-header">
        <h2>Add Health Record</h2>
        <button class="modal-close" data-close-modal>&times;</button>
      </div>

      <form id="health-form">

        <label>
          Pig
          <select name="pigId">
            ${state.pigs.map(pig => `
              <option value="${pig.id}">
                ${escapeHTML(pig.name)}
              </option>
            `).join("")}
          </select>
        </label>

        <label>
          Record Type
          <select name="type">
            <option>Health Check</option>
            <option>Vaccination</option>
            <option>Deworming</option>
            <option>Checkup</option>
          </select>
        </label>

        <label>
          Date
          <input
            type="date"
            name="date"
            required
          >
        </label>

        <label>
          Description
          <textarea
            name="description"
            placeholder="Enter details..."
            required
          ></textarea>
        </label>

        <label>
          Status
          <select name="status">
            <option>Healthy</option>
            <option>Completed</option>
            <option>Needs Attention</option>
          </select>
        </label>

        <button
          class="btn btn-primary full-width"
          type="submit"
        >
          Add Record
        </button>

      </form>
    `);

    $("#health-form").addEventListener("submit", event => {
      event.preventDefault();

      const data = new FormData(event.target);

      state.healthRecords.push({
        id: generateId(state.healthRecords),
        pigId: Number(data.get("pigId")),
        type: data.get("type"),
        date: formatDate(data.get("date")),
        description: data.get("description"),
        status: data.get("status")
      });

      saveState();
      closeModal();
      renderHealth();

      showToast("Health record added!");
    });
  }

  /* -------------------------------------------------------
     PROFILE
  ------------------------------------------------------- */

  function renderProfile() {
    setText(
      "[data-farm-name]",
      state.farm.name
    );

    setText(
      "[data-farm-location]",
      state.farm.location
    );
  }

  function showFarmForm() {
    openModal(`
      <div class="modal-header">
        <h2>Edit Farm</h2>
        <button class="modal-close" data-close-modal>&times;</button>
      </div>

      <form id="farm-form">

        <label>
          Farm Name
          <input
            name="name"
            type="text"
            value="${escapeHTML(state.farm.name)}"
            required
          >
        </label>

        <label>
          Location
          <input
            name="location"
            type="text"
            value="${escapeHTML(state.farm.location)}"
            required
          >
        </label>

        <button
          class="btn btn-primary full-width"
          type="submit"
        >
          Save Farm
        </button>

      </form>
    `);

    $("#farm-form").addEventListener("submit", event => {
      event.preventDefault();

      const data = new FormData(event.target);

      state.farm.name = data.get("name");
      state.farm.location = data.get("location");

      saveState();
      closeModal();
      renderProfile();

      showToast("Farm information updated!");
    });
  }

  /* -------------------------------------------------------
     MODAL
  ------------------------------------------------------- */

  function openModal(content) {
    closeModal();

    const overlay = document.createElement("div");

    overlay.className = "modal-overlay";

    overlay.innerHTML = `
      <div class="modal">
        ${content}
      </div>
    `;

    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.classList.add("show");
    });

    document.body.classList.add("modal-open");
  }

  function closeModal() {
    const modal = $(".modal-overlay");

    if (!modal) return;

    modal.classList.remove("show");

    setTimeout(() => {
      modal.remove();
    }, 200);

    document.body.classList.remove("modal-open");
  }

  /* -------------------------------------------------------
     EVENT HANDLING
  ------------------------------------------------------- */

  document.addEventListener("click", event => {
    const target = event.target;

    /* Navigation */
    const navItem = target.closest("[data-page]");

    if (
      navItem &&
      !target.closest("form")
    ) {
      const page = navItem.dataset.page;

      if (page) {
        navigate(page);
        return;
      }
    }

    /* Close modal */
    if (
      target.matches("[data-close-modal]") ||
      target.closest("[data-close-modal]")
    ) {
      closeModal();
      return;
    }

    /* Click outside modal */
    if (target.classList.contains("modal-overlay")) {
      closeModal();
      return;
    }

    /* View pig */
    const viewPig = target.closest("[data-action='view-pig']");

    if (viewPig) {
      showPigDetails(viewPig.dataset.id);
      return;
    }

    /* Add pig */
    if (
      target.matches("[data-add-pig]") ||
      target.closest("[data-add-pig]")
    ) {
      showPigForm();
      return;
    }

    /* Edit pig */
    const editPig = target.closest("[data-edit-pig]");

    if (editPig) {
      const pig = state.pigs.find(
        item => Number(item.id) === Number(editPig.dataset.editPig)
      );

      if (pig) {
        showPigForm(pig);
      }

      return;
    }

    /* Delete pig */
    const deletePig = target.closest("[data-delete-pig]");

    if (deletePig) {
      deletePigProfile(deletePig.dataset.deletePig);
      return;
    }

    /* Add feeding */
    if (
      target.matches("[data-add-feeding]") ||
      target.closest("[data-add-feeding]")
    ) {
      showFeedingForm();
      return;
    }

    /* Delete feeding */
    const deleteFeeding =
      target.closest("[data-delete-feeding]");

    if (deleteFeeding) {
      state.feeding = state.feeding.filter(
        feed =>
          Number(feed.id) !==
          Number(deleteFeeding.dataset.deleteFeeding)
      );

      saveState();
      renderFeeding();

      showToast("Feeding schedule removed.");
      return;
    }

    /* Add health record */
    if (
      target.matches("[data-add-health]") ||
      target.closest("[data-add-health]")
    ) {
      showHealthForm();
      return;
    }

    /* Edit farm */
    if (
      target.matches("[data-edit-farm]") ||
      target.closest("[data-edit-farm]")
    ) {
      showFarmForm();
      return;
    }

    /* Calendar date */
    const calendarDay =
      target.closest("[data-calendar-date]");

    if (calendarDay) {
      showCalendarEvents(
        calendarDay.dataset.calendarDate
      );
    }
  });

  /* -------------------------------------------------------
     DELETE PIG
  ------------------------------------------------------- */

  function deletePigProfile(id) {
    const pig = state.pigs.find(
      item => Number(item.id) === Number(id)
    );

    if (!pig) return;

    const confirmed = confirm(
      `Delete ${pig.name}'s profile?`
    );

    if (!confirmed) return;

    state.pigs = state.pigs.filter(
      item => Number(item.id) !== Number(id)
    );

    state.feeding = state.feeding.filter(
      item => Number(item.pigId) !== Number(id)
    );

    state.healthRecords = state.healthRecords.filter(
      item => Number(item.pigId) !== Number(id)
    );

    saveState();
    closeModal();

    renderPigs();
    renderDashboard();

    showToast("Pig profile deleted.");
  }

  /* -------------------------------------------------------
     CALENDAR EVENTS
  ------------------------------------------------------- */

  function showCalendarEvents(date) {
    const events = state.events.filter(
      event => event.date === date
    );

    if (!events.length) {
      showToast("No events scheduled for this date.", "info");
      return;
    }

    openModal(`
      <div class="modal-header">
        <h2>${formatDate(date)}</h2>

        <button
          class="modal-close"
          data-close-modal
        >
          &times;
        </button>
      </div>

      <div class="event-list">
        ${events.map(event => `
          <div class="event-item">
            <span class="event-dot ${event.type}"></span>

            <div>
              <strong>${escapeHTML(event.title)}</strong>
              <p>${escapeHTML(event.description)}</p>
            </div>
          </div>
        `).join("")}
      </div>
    `);
  }

  /* -------------------------------------------------------
     SEARCH
  ------------------------------------------------------- */

  document.addEventListener("input", event => {
    if (event.target.matches("[data-pig-search]")) {
      renderPigs();
    }
  });

  document.addEventListener("change", event => {
    if (event.target.matches("[data-pig-filter]")) {
      renderPigs();
    }
  });

  /* -------------------------------------------------------
     CALENDAR CONTROLS
  ------------------------------------------------------- */

  document.addEventListener("click", event => {
    const previous =
      event.target.closest("[data-calendar-prev]");

    const next =
      event.target.closest("[data-calendar-next]");

    const calendar = $("[data-calendar]");

    if (!calendar) return;

    let year =
      Number(calendar.dataset.year) ||
      new Date().getFullYear();

    let month =
      Number(calendar.dataset.month ?? new Date().getMonth());

    if (previous) {
      month--;

      if (month < 0) {
        month = 11;
        year--;
      }
    }

    if (next) {
      month++;

      if (month > 11) {
        month = 0;
        year++;
      }
    }

    if (previous || next) {
      calendar.dataset.year = year;
      calendar.dataset.month = month;

      renderCalendar();
    }
  });

  /* -------------------------------------------------------
     KEYBOARD
  ------------------------------------------------------- */

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  /* -------------------------------------------------------
     LOGIN / GET STARTED
  ------------------------------------------------------- */

  document.addEventListener("click", event => {
    if (
      event.target.matches("[data-login]") ||
      event.target.closest("[data-login]")
    ) {
      showLogin();
    }

    if (
      event.target.matches("[data-get-started]") ||
      event.target.closest("[data-get-started]")
    ) {
      navigate("home");

      showToast(
        "Welcome to PorkyPal! 🐷",
        "success"
      );
    }
  });

  function showLogin() {
    openModal(`
      <div class="modal-header">
        <h2>Welcome Back!</h2>

        <button
          class="modal-close"
          data-close-modal
        >
          &times;
        </button>
      </div>

      <form id="login-form">

        <label>
          Email
          <input
            type="email"
            name="email"
            placeholder="farmer@example.com"
            required
          >
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            required
          >
        </label>

        <button
          type="submit"
          class="btn btn-primary full-width"
        >
          Log In
        </button>

        <p class="form-note">
          Demo login — no account required.
        </p>

      </form>
    `);

    $("#login-form").addEventListener("submit", event => {
      event.preventDefault();

      closeModal();

      showToast("You're logged in! 🐷");
    });
  }

  /* -------------------------------------------------------
     NOTIFICATIONS
  ------------------------------------------------------- */

  document.addEventListener("click", event => {
    if (
      event.target.matches("[data-notifications]") ||
      event.target.closest("[data-notifications]")
    ) {
      showNotifications();
    }
  });

  function showNotifications() {
    openModal(`
      <div class="modal-header">
        <h2>Notifications</h2>

        <button
          class="modal-close"
          data-close-modal
        >
          &times;
        </button>
      </div>

      <div class="notification-list">

        <div class="notification">
          <span>🐷</span>
          <div>
            <strong>Lily's feeding time</strong>
            <p>Morning feeding is due today.</p>
          </div>
        </div>

        <div class="notification">
          <span>💗</span>
          <div>
            <strong>Upcoming birth</strong>
            <p>Lily's expected birth is approaching.</p>
          </div>
        </div>

        <div class="notification">
          <span>💊</span>
          <div>
            <strong>Health reminder</strong>
            <p>Check your pigs' health records.</p>
          </div>
        </div>

      </div>
    `);
  }

  /* -------------------------------------------------------
     INITIALIZATION
  ------------------------------------------------------- */

  function initialize() {
    renderDashboard();
    renderPigs();
    renderCalendar();
    renderFeeding();
    renderHealth();
    renderProfile();

    /* Restore current page */
    $$(".page").forEach(section => {
      section.classList.toggle(
        "active",
        section.dataset.page === state.currentPage
      );
    });

    $$(".nav-item").forEach(item => {
      item.classList.toggle(
        "active",
        item.dataset.page === state.currentPage
      );
    });

    console.log(
      "%c🐷 PorkyPal initialized!",
      "color:#ef3f83;font-size:16px;font-weight:bold;"
    );
  }

  initialize();
});

