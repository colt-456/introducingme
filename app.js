document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. 레이아웃 전환 (가로형/세로형) ---
    const btnHorizontal = document.getElementById('btn-horizontal');
    const btnVertical = document.getElementById('btn-vertical');
    const captureArea = document.getElementById('capture-area');

    btnHorizontal.addEventListener('click', () => {
        captureArea.classList.remove('vertical');
        captureArea.classList.add('horizontal');
        btnHorizontal.classList.add('active');
        btnVertical.classList.remove('active');
    });

    btnVertical.addEventListener('click', () => {
        captureArea.classList.remove('horizontal');
        captureArea.classList.add('vertical');
        btnVertical.classList.add('active');
        btnHorizontal.classList.remove('active');
    });

    // --- 2. 폰트 및 사이즈 변경 (custom-font 클래스만 대상) ---
    const fontSelector = document.getElementById('font-selector');
    const fontSizeInput = document.getElementById('font-size-input');
    const customTextElements = document.querySelectorAll('.custom-font');

    fontSelector.addEventListener('change', (e) => {
        const selectedFont = e.target.value;
        customTextElements.forEach(el => {
            el.style.fontFamily = `'${selectedFont}', monospace`;
        });
    });

    fontSizeInput.addEventListener('input', (e) => {
        const size = e.target.value;
        customTextElements.forEach(el => {
            el.style.fontSize = `${size}px`;
        });
    });

    // --- 3. 텍스트 인라인 편집 (기본 텍스트 자동 삭제/복원) ---
    const editableTexts = document.querySelectorAll('.editable-text');

    editableTexts.forEach(el => {
        el.addEventListener('focus', function() {
            const defaultText = this.getAttribute('data-default');
            if (this.textContent.trim() === defaultText) {
                this.textContent = '';
            }
        });

        el.addEventListener('blur', function() {
            if (this.textContent.trim() === '') {
                this.textContent = this.getAttribute('data-default');
            }
        });
    });

    // --- 4. 프로필 이미지 업로드 및 확대/축소/드래그 ---
    const imageUpload = document.getElementById('image-upload');
    const profilePreview = document.getElementById('profile-preview');
    let scale = 1;
    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;

    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                profilePreview.src = event.target.result;
                scale = 1; translateX = 0; translateY = 0;
                updateImageTransform();
            }
            reader.readAsDataURL(file);
        }
    });

    profilePreview.addEventListener('wheel', (e) => {
        e.preventDefault();
        scale += e.deltaY * -0.001;
        scale = Math.min(Math.max(0.5, scale), 3); // 0.5배 ~ 3배 제한
        updateImageTransform();
    });

    profilePreview.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateImageTransform();
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    function updateImageTransform() {
        profilePreview.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }

    // --- 5. PNG 저장 기능 (html2canvas) ---
    const btnDownload = document.getElementById('btn-download');
    
    btnDownload.addEventListener('click', () => {
        document.activeElement.blur(); // 캡처 전 포커스 해제
        
        html2canvas(captureArea, {
            backgroundColor: '#03080c', 
            scale: 2 
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'sys_profile.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });
});
