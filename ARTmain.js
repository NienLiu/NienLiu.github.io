document.addEventListener('DOMContentLoaded', function () {
    // 导航栏滑块功能
    const navLinks = document.querySelectorAll('.nav-links a');
    const slider = document.createElement('span');
    slider.classList.add('nav-slider');
    document.querySelector('.nav-links').appendChild(slider);

    // 设置初始滑块位置（active链接）
    const activeLink = document.querySelector('.nav-links a.active');
    if (activeLink) {
        setSliderPosition(activeLink);
    }

    // 为每个导航链接添加鼠标事件
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            setSliderPosition(link);
        });

        link.addEventListener('mouseleave', () => {
            if (activeLink) {
                setSliderPosition(activeLink);
            }
        });
    });

    // 设置滑块位置和宽度的函数
    function setSliderPosition(link) {
        const linkRect = link.getBoundingClientRect();
        const navRect = document.querySelector('.nav-links').getBoundingClientRect();
        slider.style.width = `${linkRect.width}px`;
        slider.style.left = `${linkRect.left - navRect.left}px`;
    }

    // 头图随鼠标移动效果
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth - 0.5;
            const y = e.clientY / window.innerHeight - 0.5;
            const moveX = x * 30; // 水平移动距离
            const moveY = y * 30; // 垂直移动距离
            heroImage.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    }
});