let isLoggedIn = false;

function navigate(section) {
    // Κρύβουμε όλα τα υπομενού
    const submenus = document.querySelectorAll('.submenu');
    submenus.forEach(el => el.classList.add('hidden'));
    
    // Εμφανίζουμε το ενεργό υπομενού
    const activeSubmenu = document.getElementById(`aside-${section}`);
    if (activeSubmenu) activeSubmenu.classList.remove('hidden');

    const main = document.getElementById('main-content');
    main.innerHTML = '';

    // ΛΟΓΙΚΗ ΠΛΟΗΓΗΣΗΣ
    if (section === 'bio') {
        loadBio('early');
    } else if (section === 'photos') {
        loadPhotos(); 
    } else if (section === 'honors') {
        loadHonors();
    } else if (section === 'links') {
        loadLinks();
    } else if (section === 'admin') {
        if (isLoggedIn) {
            showAdminPanel();
        } else {
            showLoginForm();
        }
    }
}

// ΒΙΟΓΡΑΦΙΑ 
function loadBio(topic) {
    const main = document.getElementById('main-content');
    let htmlContent = '<h2>Βιογραφία: Λευτέρης Πετρούνιας</h2>';

    if (topic === 'early') {
        htmlContent += `
            <h3>Πρώτα Χρόνια & Ξεκίνημα</h3>
            <div class="bio-content" style="line-height: 1.6; font-size: 1.1em;">
                <p>Γεννήθηκε στην <strong>Αθήνα στις 30 Νοεμβρίου 1990</strong>. Ξεκίνησε την ενόργανη γυμναστική σε ηλικία μόλις 5 ετών στον Πανιώνιο Γ.Σ.Σ.</p>
                <p>Ως παιδί ήταν υπερκινητικός, και η γυμναστική ήταν η ιδανική διέξοδος για την ενέργειά του. 
                Στην αρχή της εφηβείας του, έκανε ένα διάλειμμα τριών ετών από τον αθλητισμό, αλλά επέστρεψε δυναμικά στα 17 του, 
                αποφασισμένος να φτάσει στην κορυφή.</p>
                <p>Το πείσμα του και η σκληρή δουλειά τον οδήγησαν γρήγορα στην Εθνική ομάδα.</p>
            </div>
        `;
    } 
    else if (topic === 'personal') {
        htmlContent += `
            <h3>Προσωπική Ζωή</h3>
            <div class="bio-content" style="line-height: 1.6; font-size: 1.1em;">
                <p>Ο Λευτέρης Πετρούνιας είναι παντρεμένος με την επίσης πρωταθλήτρια της ενόργανης, <strong>Βασιλική Μιλλούση</strong>.</p>
                <p>Έχουν αποκτήσει δύο κόρες, τη Σοφία και την Ελένη, στις οποίες αφιερώνει όλες τις επιτυχίες του.</p>
                <p>Είναι γνωστός για το ήθος του και την ψυχική του δύναμη, έχοντας ξεπεράσει σοβαρούς τραυματισμούς και χειρουργεία 
                στους ώμους για να επιστρέψει στο βάθρο.</p>
            </div>
        `;
    }

    main.innerHTML = htmlContent;
}

//  LOGIN 
function showLoginForm() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
        <h2>Είσοδος Διαχειριστή</h2>
        <form onsubmit="handleLogin(event)" style="max-width:300px;">
            <label>Όνομα χρήστη:</label><br>
            <input type="text" id="username" required style="width:100%; margin-bottom:10px;"><br>
            <label>Κωδικός:</label><br>
            <input type="password" id="password" required style="width:100%; margin-bottom:10px;"><br>
            <button type="submit" style="background: green; color: white; padding: 5px 10px;">Σύνδεση</button>
        </form>
        <p id="login-msg" style="color:red;"></p>
    `;
}

async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (data.success) {
        isLoggedIn = true;
        navigate('admin');
    } else {
        document.getElementById('login-msg').innerText = 'Λάθος στοιχεία!';
    }
}

//  ADMIN PANEL 
function showAdminPanel() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
        <h2>Πάνελ Διαχείρισης</h2>
        <button onclick="isLoggedIn=false; navigate('admin')" style="background:red; color:white; margin-bottom:20px;">Αποσύνδεση</button>
        
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
            <div style="border:1px solid #ccc; padding:10px;">
                <h3>Διαχείριση Διακρίσεων</h3>
                <input type="text" id="new-year" placeholder="Έτος" style="width:30%">
                <input type="text" id="new-honor" placeholder="Τίτλος" style="width:60%">
                <button onclick="addHonor()" style="width:100%; margin-top:5px; background:#2c3e50; color:white;">Προσθήκη</button>
                <hr>
                <div id="admin-honors-list">Φόρτωση λίστας...</div>
            </div>

            <div style="border:1px solid #ccc; padding:10px;">
                <h3>Διαχείριση Συνδέσμων</h3>
                <input type="text" id="new-link-title" placeholder="Τίτλος" style="width:45%">
                <input type="text" id="new-link-url" placeholder="URL" style="width:45%">
                <select id="new-link-cat" style="width:100%; margin-top:5px;">
                    <option value="video">Video</option>
                    <option value="web">Web</option>
                </select>
                <button onclick="addLink()" style="width:100%; margin-top:5px; background:#2c3e50; color:white;">Προσθήκη</button>
                <hr>
                <div id="admin-links-list">Φόρτωση λίστας...</div>
            </div>
        </div>
    `;
    loadAdminHonors();
    loadAdminLinks();
}

//  ΛΕΙΤΟΥΡΓΙΕΣ 
async function addHonor() {
    const year = document.getElementById('new-year').value;
    const title = document.getElementById('new-honor').value;
    if(!year || !title) return alert('Συμπληρώστε τα πεδία');

    await fetch('/api/honors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, title })
    });
    document.getElementById('new-honor').value = ''; 
    loadAdminHonors();
}

async function loadAdminHonors() {
    const res = await fetch('/api/honors');
    const data = await res.json();
    let html = '<ul style="padding-left:0; list-style:none;">';
    data.forEach(item => {
        html += `<li style="margin-bottom:5px; border-bottom:1px solid #eee; padding:5px;">
                    <b>${item.year}</b>: ${item.title} 
                    <button onclick="deleteHonor(${item.id})" style="background:red; color:white; border:none; float:right; cursor:pointer;">X</button>
                 </li>`;
    });
    document.getElementById('admin-honors-list').innerHTML = html + '</ul>';
}

async function deleteHonor(id) {
    if(!confirm('Σίγουρα διαγραφή;')) return;
    await fetch(`/api/honors/${id}`, { method: 'DELETE' });
    loadAdminHonors();
}

async function addLink() {
    const title = document.getElementById('new-link-title').value;
    const url = document.getElementById('new-link-url').value;
    const category = document.getElementById('new-link-cat').value;
    if(!title || !url) return alert('Συμπληρώστε τα πεδία');

    await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, url, category })
    });
    document.getElementById('new-link-title').value = '';
    loadAdminLinks();
}

async function loadAdminLinks() {
    const res = await fetch('/api/links');
    const data = await res.json();
    let html = '<ul style="padding-left:0; list-style:none;">';
    data.forEach(item => {
        html += `<li style="margin-bottom:5px; border-bottom:1px solid #eee; padding:5px;">
                    ${item.title} 
                    <button onclick="deleteLink(${item.id})" style="background:red; color:white; border:none; float:right; cursor:pointer;">X</button>
                 </li>`;
    });
    document.getElementById('admin-links-list').innerHTML = html + '</ul>';
}

async function deleteLink(id) {
    if(!confirm('Σίγουρα διαγραφή;')) return;
    await fetch(`/api/links/${id}`, { method: 'DELETE' });
    loadAdminLinks();
}

//  VIEW ONLY 
async function loadHonors() {
    const main = document.getElementById('main-content');
    const res = await fetch('/api/honors');
    const data = await res.json();
    let html = '<h2>Διακρίσεις</h2><table border="1" cellpadding="5" style="border-collapse:collapse; width:100%">';
    data.forEach(i => html += `<tr><td>${i.year}</td><td>${i.title}</td></tr>`);
    main.innerHTML = html + '</table>';
}

async function loadLinks(category) {
    const main = document.getElementById('main-content');
    const res = await fetch('/api/links');
    const data = await res.json();
    
    // Φιλτράρισμα βάσει κατηγορίας
    // Αν δεν έχει επιλεγεί κατηγορία, δεν δείχνουμε τίποτα ή μήνυμα
    if (!category) {
        main.innerHTML = '<h2>Σύνδεσμοι</h2><p>Επιλέξτε κατηγορία από το πλευρικό μενού.</p>';
        return;
    }

    // Φιλτράρουμε τα δεδομένα 
    const filteredLinks = data.filter(link => link.category === category);

    let html = `<h2>Σύνδεσμοι: ${category === 'video' ? 'Βίντεο' : 'Άρθρα'}</h2><ul>`;
    
    if (filteredLinks.length === 0) {
        html += '<p>Δεν βρέθηκαν σύνδεσμοι σε αυτή την κατηγορία.</p>';
    } else {
        filteredLinks.forEach(i => {
            html += `<li><a href="${i.url}" target="_blank">${i.title}</a></li>`;
        });
    }
    main.innerHTML = html + '</ul>';
}

// ΦΩΤΟΓΡΑΦΙΕΣ 
function loadPhotos(category) {
    const main = document.getElementById('main-content');
    let htmlContent = '<h2>Φωτογραφίες</h2>';

    if (!category) {
        htmlContent += `
            <p>Επιλέξτε μια κατηγορία από το πλευρικό μενού (Αγώνες ή Προπονήσεις) για να δείτε το άλμπουμ.</p>
        `;
    } 
    else if (category === 'competition') {
        htmlContent += `
            <h3>Στιγμές από Αγώνες</h3>
            <div class="photo-gallery">
                <div class="photo-item">
                    <img src="images/1.jpg" alt="Αγώνας 1">
                    <p>Χρυσό Μετάλλιο - Ολυμπιακοί Αγώνες Ρίο</p>
                </div>
                <div class="photo-item">
                    <img src="images/tokio2.jpg" alt="Αγώνας 2">
                    <p>Χάλκινο Μετάλλιο - Ολυμπιακοί Αγώνες Τόκιο</p>
                </div>
                <div class="photo-item">
                    <img src="images/parisi3.jpeg" alt="Αγώνας 3">
                    <p>Χάλκινο Μετάλλιο - Ολυμπιακοί Αγώνες Παρίσι</p>
                </div>
                <div class="photo-item">
                    <img src="images/4.jpg" alt="Αγώνας 4">
                    <p>Χρυσό - Παγκόσμιο Πρωτάθλημα Γλασκώβη</p>
                </div>
                <div class="photo-item">
                    <img src="images/ntoxa5.jpg" alt="Αγώνας 5">
                    <p>Χρυσό - Παγκόσμιο Πρωτάθλημα Ντόχα</p>
                </div>
            </div>`;
    } 
    else if (category === 'training') {
        htmlContent += `
            <h3>Στιγμές Προπόνησης</h3>
            <div class="photo-gallery">
                <div class="photo-item">
                    <img src="images/proponisi.jpg" alt="Προπόνηση 1">
                    <p>Προετοιμασία</p>
                </div>
                <div class="photo-item">
                    <img src="images/4.jpg" alt="Προπόνηση 2">
                    <p>Γυμναστήριο</p>
                </div>
            </div>`;
    }

    main.innerHTML = htmlContent;
}