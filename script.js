(function(){
'use strict';

// ===== PRELOADER =====
var preloader=document.getElementById('preloader');
var preloaderFill=document.getElementById('preloaderFill');
var preloaderPercent=document.getElementById('preloaderPercent');
var progress=0;

function loadProgress(){
    progress+=Math.random()*15+5;
    if(progress>100)progress=100;
    preloaderFill.style.width=progress+'%';
    if(preloaderPercent)preloaderPercent.textContent=Math.round(progress)+'%';
    if(progress<100){
        setTimeout(loadProgress,150);
    }else{
        setTimeout(function(){
            preloader.classList.add('hidden');
            document.body.style.overflow='auto';
            initCursor();
            initReveal();
            initGallery();
            initFloatingButtons();
            initLightbox();
        },400);
    }
}
loadProgress();

// ===== CURSOR =====
function initCursor(){
    var cursor=document.getElementById('cursor');
    var dot=document.getElementById('cursorDot');
    if(!cursor||!dot)return;
    var mx=0,my=0,cx=0,cy=0,dx=0,dy=0;
    cursor.classList.add('visible');
    dot.classList.add('visible');
    document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY});
    (function animate(){
        cx+=(mx-cx)*0.12;
        cy+=(my-cy)*0.12;
        dx+=(mx-dx)*0.25;
        dy+=(my-dy)*0.25;
        cursor.style.left=cx+'px';
        cursor.style.top=cy+'px';
        dot.style.left=dx+'px';
        dot.style.top=dy+'px';
        requestAnimationFrame(animate);
    })();
    var targets=document.querySelectorAll('a,button,.package-card,.gallery-item,.service-card,.story-img,.faq-item,.testimonial-card,.pkg-btn,.nav-cta');
    targets.forEach(function(el){
        el.addEventListener('mouseenter',function(){cursor.classList.add('hover')});
        el.addEventListener('mouseleave',function(){cursor.classList.remove('hover')});
    });
}

// ===== SCROLL PROGRESS =====
var scrollBar=document.getElementById('scrollProgress');
window.addEventListener('scroll',function(){
    if(scrollBar){
        var max=document.documentElement.scrollHeight-window.innerHeight;
        var val=window.scrollY/max;
        scrollBar.style.transform='scaleX('+val+')';
    }
});

// ===== NAV =====
var nav=document.getElementById('navbar');
window.addEventListener('scroll',function(){
    nav.classList.toggle('scrolled',window.scrollY>50);
});

// ===== MOBILE MENU =====
var menuBtn=document.getElementById('menuBtn');
var mobMenu=document.getElementById('mobMenu');
var isOpen=false;
if(menuBtn&&mobMenu){
    menuBtn.addEventListener('click',function(){
        isOpen=!isOpen;
        mobMenu.classList.toggle('open',isOpen);
        menuBtn.innerHTML=isOpen?'<span class="iconify" data-icon="lucide:x"></span>':'<span class="iconify" data-icon="lucide:menu"></span>';
    });
    document.querySelectorAll('.mob-link').forEach(function(link){
        link.addEventListener('click',function(){
            isOpen=false;
            mobMenu.classList.remove('open');
            menuBtn.innerHTML='<span class="iconify" data-icon="lucide:menu"></span>';
        });
    });
}

// ===== REVEAL =====
function initReveal(){
    var observer=new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
            if(entry.isIntersecting){
                entry.target.classList.add('visible');
                var num=entry.target.querySelector('[data-count]');
                if(num&&!num.dataset.done){
                    animateNumber(num);
                }
            }
        });
    },{threshold:0.08,rootMargin:'0px 0px -40px 0px'});
    document.querySelectorAll('.reveal').forEach(function(el){observer.observe(el)});
}

function animateNumber(el){
    el.dataset.done='1';
    var target=+el.dataset.count;
    var duration=2000;
    var start=performance.now();
    (function update(time){
        var progress=Math.min((time-start)/duration,1);
        var eased=1-Math.pow(1-progress,3);
        el.textContent=Math.round(target*eased);
        if(progress<1)requestAnimationFrame(update);
        else el.textContent=target+'+';
    })(start);
}

// ===== GALLERY SCROLL =====
function initGallery(){
    var track=document.getElementById('galleryTrack');
    var wrap=document.getElementById('galleryWrap');
    if(!track||!wrap)return;
    var pos=0,target=0,dragging=false,startX=0,startPos=0;
    wrap.addEventListener('wheel',function(e){
        e.preventDefault();
        target+=e.deltaY*0.6;
        var max=track.scrollWidth-wrap.clientWidth;
        target=Math.max(0,Math.min(target,max));
    },{passive:false});
    wrap.addEventListener('mousedown',function(e){
        dragging=true;
        startX=e.clientX;
        startPos=target;
        wrap.style.cursor='grabbing';
    });
    document.addEventListener('mousemove',function(e){
        if(!dragging)return;
        target=startPos+(startX-e.clientX);
        var max=track.scrollWidth-wrap.clientWidth;
        target=Math.max(0,Math.min(target,max));
    });
    document.addEventListener('mouseup',function(){dragging=false;wrap.style.cursor='grab'});
    wrap.addEventListener('touchstart',function(e){
        dragging=true;
        startX=e.touches[0].clientX;
        startPos=target;
    },{passive:true});
    document.addEventListener('touchmove',function(e){
        if(!dragging)return;
        target=startPos+(startX-e.touches[0].clientX);
        var max=track.scrollWidth-wrap.clientWidth;
        target=Math.max(0,Math.min(target,max));
    },{passive:true});
    document.addEventListener('touchend',function(){dragging=false});
    (function animate(){
        pos+=(target-pos)*0.09;
        track.style.transform='translateX(-'+pos+'px)';
        requestAnimationFrame(animate);
    })();
}

// ===== LIGHTBOX =====
function initLightbox(){
    var items=document.querySelectorAll('.gallery-item');
    if(!items.length)return;
    var lightbox=document.createElement('div');
    lightbox.className='lightbox';
    lightbox.innerHTML='<button class="lightbox-close" id="lbClose"><span class="iconify" data-icon="lucide:x"></span></button>'+
        '<div class="lightbox-counter" id="lbCounter">1 / 1</div>'+
        '<button class="lightbox-nav lightbox-prev" id="lbPrev"><span class="iconify" data-icon="lucide:chevron-left"></span></button>'+
        '<button class="lightbox-nav lightbox-next" id="lbNext"><span class="iconify" data-icon="lucide:chevron-right"></span></button>'+
        '<div class="lightbox-content"><img class="lightbox-img" id="lbImg" src="" alt=""><div class="lightbox-caption" id="lbCaption"><span class="lightbox-cat"></span><p class="lightbox-title"></p></div></div>';
    document.body.appendChild(lightbox);

    var lb=lightbox,lbImg=document.getElementById('lbImg'),lbCap=document.getElementById('lbCaption');
    var lbCount=document.getElementById('lbCounter'),lbClose=document.getElementById('lbClose');
    var lbPrev=document.getElementById('lbPrev'),lbNext=document.getElementById('lbNext');
    var data=[],current=0;

    items.forEach(function(item){
        data.push({
            src:item.dataset.img,
            cat:item.dataset.cat,
            title:item.dataset.title
        });
        item.addEventListener('click',function(){openLightbox(Array.from(items).indexOf(item))});
    });

    function openLightbox(index){
        if(index<0||index>=data.length)return;
        current=index;
        var d=data[index];
        lbImg.src=d.src;
        lbCap.querySelector('.lightbox-cat').textContent=d.cat;
        lbCap.querySelector('.lightbox-title').textContent=d.title;
        lbCount.textContent=(index+1)+' / '+data.length;
        lb.classList.add('active');
        document.body.style.overflow='hidden';
    }

    function closeLightbox(){
        lb.classList.remove('active');
        document.body.style.overflow='';
    }

    function prev(){
        current=current-1<0?data.length-1:current-1;
        openLightbox(current);
    }

    function next(){
        current=(current+1)%data.length;
        openLightbox(current);
    }

    lbClose.addEventListener('click',closeLightbox);
    lbPrev.addEventListener('click',prev);
    lbNext.addEventListener('click',next);
    lb.addEventListener('click',function(e){if(e.target===lb)closeLightbox()});
    document.addEventListener('keydown',function(e){
        if(e.key==='Escape')closeLightbox();
        if(e.key==='ArrowLeft'&&lb.classList.contains('active'))prev();
        if(e.key==='ArrowRight'&&lb.classList.contains('active'))next();
    });
}

// ===== FLOATING BUTTONS =====
function initFloatingButtons(){
    var btns=document.getElementById('floatingBtns');
    if(!btns)return;
    window.addEventListener('scroll',function(){
        btns.classList.toggle('show',window.scrollY>600);
    });
}

// ===== HERO VIDEO =====
var heroVideo=document.getElementById('heroVideo');
if(heroVideo){heroVideo.play().catch(function(){})}

// ===== FORM → WHATSAPP =====
var form=document.getElementById('contactForm');
if(form){
    form.addEventListener('submit',function(e){
        e.preventDefault();
        var inputs=this.querySelectorAll('input,select,textarea');
        var name=inputs[0]?inputs[0].value:'';
        var partner=inputs[1]?inputs[1].value:'';
        var contact=inputs[2]?inputs[2].value:'';
        var date=inputs[3]?inputs[3].value:'';
        var service=inputs[4]?inputs[4].value:'';
        var msg=document.querySelector('textarea');
        var message=msg?msg.value:'';
        var text='Halo FRAND.ART, saya ingin konsultasi jasa foto wedding.%0A%0A'+
            'Nama: '+name+'%0A'+
            'Pasangan: '+partner+'%0A'+
            'Kontak: '+contact+'%0A'+
            'Tanggal: '+date+'%0A'+
            'Layanan: '+service+'%0A'+
            'Pesan: '+message;
        window.open('https://wa.me/6282146620668?text='+text,'_blank');
        var toast=document.getElementById('toast');
        if(toast){
            toast.classList.add('show');
            setTimeout(function(){toast.classList.remove('show')},4000);
        }
        this.reset();
    });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(function(link){
    link.addEventListener('click',function(e){
        e.preventDefault();
        var target=document.querySelector(this.getAttribute('href'));
        if(target){
            target.scrollIntoView({behavior:'smooth',block:'start'});
            // close mobile menu if open
            var mob=document.getElementById('mobMenu');
            var btn=document.getElementById('menuBtn');
            if(mob&&mob.classList.contains('open')){
                mob.classList.remove('open');
                if(btn)btn.innerHTML='<span class="iconify" data-icon="lucide:menu"></span>';
            }
        }
    });
});

// ===== KEYBOARD SHORTCUT (accessibility) =====
document.addEventListener('keydown',function(e){
    if(e.key==='Tab'){
        document.querySelector('.cursor')?.classList.add('hidden');
        document.querySelector('.cursor-dot')?.classList.add('hidden');
    }
});

})();