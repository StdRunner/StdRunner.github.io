function printPasswordModal() {
    const careerPwModal = document.getElementById('career-password');
    const careerPwModalBg = document.getElementById('career-password-bg');
    const careerPWInput = document.getElementById('password-input');

    careerPwModal.classList.remove('disappear');
    careerPwModalBg.classList.remove('disappear');
    careerPwModal.classList.add('appear');
    careerPwModalBg.classList.add('appear');
    careerPWInput.focus();
}

function hidePasswordModal() {
    const careerPwModal = document.getElementById('career-password');
    const careerPwModalBg = document.getElementById('career-password-bg');

    careerPwModal.classList.add('disappear');
    careerPwModalBg.classList.add('disappear');

    setTimeout(function(){
        careerPwModal.classList.remove('appear');
        careerPwModalBg.classList.remove('appear');
    }, 190);
}

