// TypeScript transpiled to JavaScript
document.addEventListener("DOMContentLoaded", () => {
    // Hilfs-Funktionen
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
    const makeId = () => `top-${Math.random().toString(36).slice(2, 9)}`;

    // DOM-Elemente
    const header = $("#header");
    const topPage = $("#top-page");
    const topForm = $("#top-form");
    const topInput = $("#top-input");
    const topTree = $("#top-tree");
    const modal = $("#modal");
    const modalTitle = $("#modal-title");
    const modalBody = $("#modal-body");
    const closeModalBtn = $("#close-modal");
    const uiStore = $("#ui-store");

    // Untertitel hinzufügen
    if (!$(".header-subtitle", header)) {
        const subtitle = document.createElement("div");
        subtitle.className = "header-subtitle";
        const date = new Date().toLocaleDateString('de-DE', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        subtitle.textContent = `Ordentlicher Convent • ${date}`;
        header.appendChild(subtitle);
    }

    // Nummerierung
    function renumberTree(rootUl, prefix = "") {
        const lis = Array.from(rootUl.children).filter(n => n instanceof HTMLLIElement);
        lis.forEach((li, idx) => {
            const number = prefix ? `${prefix}.${idx + 1}` : `${idx + 1}`;
            const numSpan = $(".top-number", li);
            if (numSpan) numSpan.textContent = number;

            const subUl = li.querySelector(":scope > ul");
            if (subUl) renumberTree(subUl, number);
        });
    }

    // Map für Antrags-UIs
    const antragsUiById = new Map();

    // TOP-Listeneintrag erstellen
    function createTopListItem(title) {
        const id = makeId();
        const li = document.createElement("li");
        li.dataset.id = id;

        const row = document.createElement("div");
        row.className = "top-row";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.addEventListener("change", () => {
            li.style.opacity = checkbox.checked ? "0.6" : "1";
            titleSpan.style.textDecoration = checkbox.checked ? "line-through" : "none";
        });

        const num = document.createElement("span");
        num.className = "top-number";
        num.textContent = "?";

        const titleSpan = document.createElement("span");
        titleSpan.className = "top-title";
        titleSpan.contentEditable = "true";
        titleSpan.textContent = title;
        titleSpan.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                e.target.blur();
            }
        });

        const actions = document.createElement("div");
        actions.className = "top-actions";

        const openBtn = document.createElement("button");
        openBtn.className = "action-btn btn-primary";
        openBtn.textContent = "Öffnen";
        openBtn.addEventListener("click", () => {
            const number = num.textContent || "";
            const t = titleSpan.textContent || "TOP";
            openModalForTop(id, `TOP ${number}: ${t}`);
        });

        const addSubBtn = document.createElement("button");
        addSubBtn.className = "action-btn btn-secondary";
        addSubBtn.textContent = "Unterpunkt";
        addSubBtn.addEventListener("click", () => {
            const t = prompt("Titel des Unterpunkts:");
            if (!t || !t.trim()) return;
            const sub = createTopListItem(t.trim());
            let subUl = li.querySelector(":scope > ul");
            if (!subUl) {
                subUl = document.createElement("ul");
                li.appendChild(subUl);
            }
            subUl.appendChild(sub);
            renumberTree(topTree);
        });

        const delBtn = document.createElement("button");
        delBtn.className = "action-btn btn-danger";
        delBtn.textContent = "Löschen";
        delBtn.addEventListener("click", () => {
            if (confirm("TOP wirklich löschen?")) {
                const ui = antragsUiById.get(id);
                if (ui) {
                    ui.remove();
                    antragsUiById.delete(id);
                }
                li.remove();
                renumberTree(topTree);
            }
        });

        actions.append(openBtn, addSubBtn, delBtn);
        row.append(checkbox, num, titleSpan, actions);
        li.appendChild(row);
        return li;
    }

    // Antrags-UI erstellen (vereinfacht für Beispiel)
    function buildAntragsUI() {
        const root = document.createElement("div");
        root.className = "antrags-ui";

        const form = document.createElement("form");
        form.className = "antrag-form";

        const select = document.createElement("select");
        ["Tagesordnungsantrag", "Geschäftsordnungsantrag", "Finanzantrag", "Satzungsänderung"].forEach(txt => {
            const option = document.createElement("option");
            option.value = option.textContent = txt;
            select.appendChild(option);
        });

        const titleInput = document.createElement("input");
        titleInput.placeholder = "Titel des Antrags";
        titleInput.required = true;

        const submitBtn = document.createElement("button");
        submitBtn.className = "action-btn btn-primary";
        submitBtn.textContent = "Antrag hinzufügen";
        submitBtn.type = "submit";

        const descTextarea = document.createElement("textarea");
        descTextarea.placeholder = "Beschreibung (max. 500 Zeichen)";
        descTextarea.maxLength = 500;

        const counter = document.createElement("div");
        counter.className = "character-counter";
        const updateCounter = () => counter.textContent = `${descTextarea.value.length}/500 Zeichen`;
        descTextarea.addEventListener("input", updateCounter);
        updateCounter();

        form.append(select, titleInput, submitBtn, descTextarea, counter);

        const list = document.createElement("div");
        list.style.marginTop = "2rem";

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const card = document.createElement("div");
            card.className = "antrag-card";

            const header = document.createElement("div");
            header.className = "antrag-header";

            const left = document.createElement("div");
            const chip = document.createElement("span");
            chip.className = "status-chip";
            chip.textContent = select.value;

            const titleEl = document.createElement("h3");
            titleEl.textContent = titleInput.value;
            titleEl.style.margin = "0";
            titleEl.style.color = "var(--dark-burgundy)";

            left.append(chip, titleEl);

            const descEl = document.createElement("p");
            descEl.textContent = descTextarea.value;
            descEl.style.marginTop = "1rem";

            // Abstimmungsbereich
            const votesDiv = document.createElement("div");
            votesDiv.className = "stimmen";

            ["Ja-Stimmen", "Nein-Stimmen", "Enthaltungen"].forEach(label => {
                const wrapper = document.createElement("div");
                const labelEl = document.createElement("label");
                labelEl.textContent = label;
                const input = document.createElement("input");
                input.type = "number";
                input.min = "0";
                input.placeholder = "0";
                wrapper.append(labelEl, input);
                votesDiv.appendChild(wrapper);
            });

            header.appendChild(left);
            card.append(header, descEl, votesDiv);
            list.appendChild(card);

            // Reset form
            titleInput.value = "";
            descTextarea.value = "";
            updateCounter();
        });

        root.append(form, list);
        return root;
    }

    // Modal öffnen
    function openModalForTop(id, title) {
        modalTitle.textContent = title;

        let ui = antragsUiById.get(id);
        if (!ui) {
            ui = buildAntragsUI();
            ui.dataset.topId = id;
            antragsUiById.set(id, ui);
        } else if (ui.parentElement === uiStore) {
            uiStore.removeChild(ui);
        }

        modalBody.innerHTML = "";
        modalBody.appendChild(ui);
        modal.classList.remove("hidden");
    }

    // Modal schließen
    closeModalBtn.addEventListener("click", () => {
        const current = $(".antrags-ui", modalBody);
        if (current) uiStore.appendChild(current);
        modal.classList.add("hidden");
    });

    // TOP hinzufügen
    topForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const txt = topInput.value.trim();
        if (!txt) return;
        const li = createTopListItem(txt);
        topTree.appendChild(li);
        topInput.value = "";
        renumberTree(topTree);
    });

    // Standard-TOPs
    if (topTree.children.length === 0) {
        ["Begrüßung und Feststellung der Beschlussfähigkeit",
            "Genehmigung des Protokolls",
            "Berichte",
            "Kassenbericht",
            "Anträge",
            "Verschiedenes"].forEach(title => {
            topTree.appendChild(createTopListItem(title));
        });
        renumberTree(topTree);
    }
});