document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Element Selectors ---
    const form = document.getElementById('cv-form');
    const cvPreview = document.getElementById('cv-preview');
    const templateSelect = document.getElementById('template-select');
    const downloadPdfBtn = document.getElementById('download-pdf-btn');
    const resetBtn = document.getElementById('reset-btn');
    const addExperienceBtn = document.getElementById('add-experience-btn');
    const addEducationBtn = document.getElementById('add-education-btn');
    const experienceContainer = document.getElementById('experience-container');
    const educationContainer = document.getElementById('education-container');

    // --- Initial State ---
    let experienceCount = 0;
    let educationCount = 0;
    let profilePicDataUrl = null; // Store profile picture as base64 data URL

    // --- Core Functions ---

    /**
     * Renders the entire CV preview based on form data.
     */
    const renderCV = () => {
        const formData = new FormData(form);

        // Personal Details
        const fullName = formData.get('fullName') || 'Your Name';
        const jobTitle = formData.get('jobTitle') || 'Your Job Title';
        const phone = formData.get('phone') || 'Your Phone';
        const email = formData.get('email') || 'your.email@example.com';
        const address = formData.get('address') || 'Your Address';
        const summary = formData.get('summary') || 'Write a brief, compelling summary of your professional background.';
        const profilePicUrl = profilePicDataUrl; // Use stored base64 data URL
        const skillsRaw = formData.get('skills') || '';
        const skills = skillsRaw ? skillsRaw.split(',').map(skill => skill.trim()).filter(skill => skill) : [];

        // Dynamic Sections - read actual DOM entries so removed entries are ignored
        const experiences = [];
        const expEntries = experienceContainer.querySelectorAll('.experience-entry');
        expEntries.forEach(entry => {
            const titleEl = entry.querySelector('input[name^="experience-title-"]');
            const companyEl = entry.querySelector('input[name^="experience-company-"]');
            const dateEl = entry.querySelector('input[name^="experience-date-"]');
            const descEl = entry.querySelector('textarea[name^="experience-description-"]');
            experiences.push({
                title: titleEl?.value || 'Job Title',
                company: companyEl?.value || 'Company Name',
                date: dateEl?.value || 'Date Range',
                description: descEl?.value || 'Describe your responsibilities and achievements.'
            });
        });

        const educations = [];
        const eduEntries = educationContainer.querySelectorAll('.education-entry');
        eduEntries.forEach(entry => {
            const degreeEl = entry.querySelector('input[name^="education-degree-"]');
            const instEl = entry.querySelector('input[name^="education-institution-"]');
            const dateEl = entry.querySelector('input[name^="education-date-"]');
            educations.push({
                degree: degreeEl?.value || 'Degree Name',
                institution: instEl?.value || 'Institution Name',
                date: dateEl?.value || 'Date Range'
            });
        });

        // Build the HTML for the preview
        cvPreview.innerHTML = `
            <div class="header">
                ${profilePicUrl ? `<img src="${profilePicUrl}" alt="Profile Picture" style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover; margin-bottom: 1rem;">` : ''}
                <h1>${fullName}</h1>
                <h2>${jobTitle}</h2>
                <div class="contact-info">
                    <p>${phone} | ${email} | ${address}</p>
                </div>
            </div>

            <div class="summary mb-3">
                <p>${summary}</p>
            </div>

            <div class="experience-section">
                <h3 class="section-title">Experience</h3>
                ${experiences.map(exp => `
                    <div class="experience-item">
                        <div class="item-header">
                            <div>
                                <h3>${exp.title}</h3>
                                <p>${exp.company}</p>
                            </div>
                            <span class="date">${exp.date}</span>
                        </div>
                        <p>${exp.description}</p>
                    </div>
                `).join('')}
            </div>

            <div class="education-section">
                <h3 class="section-title">Education</h3>
                ${educations.map(edu => `
                    <div class="education-item">
                        <div class="item-header">
                            <div>
                                <h3>${edu.degree}</h3>
                                <p>${edu.institution}</p>
                            </div>
                            <span class="date">${edu.date}</span>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="skills-section">
                <h3 class="section-title">Skills</h3>
                <ul class="skills-list">
                    ${skills.map(skill => `<li>${skill}</li>`).join('')}
                </ul>
            </div>
        `;

        // Apply selected theme (remove previous theme- classes, keep template classes)
        const selectedTheme = document.querySelector('input[name="cvTheme"]:checked')?.value || 'theme-default';
        Array.from(cvPreview.classList).forEach(className => {
            if (className.startsWith('theme-')) cvPreview.classList.remove(className);
        });
        cvPreview.classList.add(selectedTheme);
    };

    // Expose renderCV globally for inline event handlers added to dynamic HTML
    window.renderCV = renderCV;

    /**
     * Adds a new experience entry to the form and preview.
     */
    const addExperienceEntry = () => {
        const id = experienceCount++;
        const entryHtml = `
            <div class="experience-entry border p-3 mb-3 rounded" data-id="${id}">
                <button type="button" class="btn-close float-end" aria-label="Close" onclick="this.parentElement.remove(); renderCV();"></button>
                <div class="mb-2">
                    <label class="form-label">Job Title</label>
                    <input type="text" class="form-control" name="experience-title-${id}" oninput="renderCV()">
                </div>
                <div class="mb-2">
                    <label class="form-label">Company</label>
                    <input type="text" class="form-control" name="experience-company-${id}" oninput="renderCV()">
                </div>
                <div class="mb-2">
                    <label class="form-label">Date Range</label>
                    <input type="text" class="form-control" name="experience-date-${id}" placeholder="2025 - Present" oninput="renderCV()">
                </div>
                <div class="mb-2">
                    <label class="form-label">Description</label>
                    <textarea class="form-control" name="experience-description-${id}" rows="3" oninput="renderCV()"></textarea>
                </div>
            </div>
        `;
        experienceContainer.insertAdjacentHTML('beforeend', entryHtml);
    };

    /**
     * Adds a new education entry to the form and preview.
     */
    const addEducationEntry = () => {
        const id = educationCount++;
        const entryHtml = `
            <div class="education-entry border p-3 mb-3 rounded" data-id="${id}">
                <button type="button" class="btn-close float-end" aria-label="Close" onclick="this.parentElement.remove(); renderCV();"></button>
                <div class="mb-2">
                    <label class="form-label">Degree / Field of Study</label>
                    <input type="text" class="form-control" name="education-degree-${id}" oninput="renderCV()">
                </div>
                <div class="mb-2">
                    <label class="form-label">Institution Name</label>
                    <input type="text" class="form-control" name="education-institution-${id}" oninput="renderCV()">
                </div>
                <div class="mb-2">
                    <label class="form-label">Date Range</label>
                    <input type="text" class="form-control" name="education-date-${id}" placeholder="(4 yaers)" oninput="renderCV()">
                </div>
            </div>
        `;
        educationContainer.insertAdjacentHTML('beforeend', entryHtml);
    };
    
    /**
     * Generates and downloads the CV as a PDF file.
     */
    const generatePDF = () => {
        window.jsPDF = window.jspdf.jsPDF;
        const doc = new jsPDF('p', 'mm', 'a4');

        // Use html2canvas to convert the HTML element to a canvas
        html2canvas(cvPreview, {
            scale: 2, // Increase scale for better quality
            useCORS: true, // Allow cross-origin images
            logging: false,
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 295; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            // Add the image to the PDF
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // If the content is longer than one page, add new pages
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            
            // Save the PDF using the full name input (sanitized) or fallback to 'cv'
            const rawName = document.getElementById('fullName')?.value || 'cv';
            const fileName = String(rawName).replace(/[^a-z0-9_\- ]/gi, '').trim() || 'cv';
            doc.save(`${fileName}.pdf`);
        });
    };

    // --- Event Listeners ---

    // Handle profile picture file selection
    const profilePictureInput = document.getElementById('profilePicture');
    profilePictureInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                profilePicDataUrl = event.target.result; // Store as base64 data URL
                renderCV();
            };
            reader.readAsDataURL(file);
        } else {
            profilePicDataUrl = null;
            renderCV();
        }
    });

    // Live preview on any input change
    form.addEventListener('input', renderCV);

    // Template change
    templateSelect.addEventListener('change', (e) => {
        // Remove only template- prefixed classes, keep theme- classes
        Array.from(cvPreview.classList).forEach(c => { if (c.startsWith('template-')) cvPreview.classList.remove(c); });
        cvPreview.classList.add(e.target.value);
        renderCV(); // Re-render to apply new styles
    });

    // Add dynamic entries
    addExperienceBtn.addEventListener('click', addExperienceEntry);
    addEducationBtn.addEventListener('click', addEducationEntry);

    document.querySelectorAll('input[name="cvTheme"]').forEach(radio => {
        radio.addEventListener('change', renderCV);
    });

    // Download PDF
    downloadPdfBtn.addEventListener('click', generatePDF);

    // Reset form
    resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all fields?')) {
            form.reset();
            experienceContainer.innerHTML = '';
            educationContainer.innerHTML = '';
            experienceCount = 0;
            educationCount = 0;
            // Reset to defaults: template + theme
            // Remove any template- or theme- classes then set defaults
            Array.from(cvPreview.classList).forEach(c => { if (c.startsWith('template-') || c.startsWith('theme-')) cvPreview.classList.remove(c); });
            cvPreview.classList.add('template-modern', 'theme-default');
            templateSelect.value = 'template-modern';
            const defaultThemeInput = document.querySelector('input[name="cvTheme"][value="theme-default"]');
            if (defaultThemeInput) defaultThemeInput.checked = true;
            renderCV();
        }
    });

    // --- Initial Load ---
    // Add one empty experience and education entry to start
    addExperienceEntry();
    addEducationEntry();
    renderCV();

});
