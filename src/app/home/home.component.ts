import { Component, HostListener, AfterViewInit, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import lottie from 'lottie-web';

interface Project {
  id: string;
  tech: string;
  category: string;
  title: string;
  desc: string;
  link: string;
  visitLink?: string;
  image?: string;
}

interface Experience {
  position: string;
  company: string;
  period: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnInit {
  currentSection: string = 'personal-photo';
  sections = ['personal-photo', 'about', 'projects', 'experience', 'contact'];
  sending = false;
  isMobile: boolean = false;
  isDarkTheme = true;
  isMobileMenuOpen = false;
  particles: any[] = [];
  mousePosition = { x: 0, y: 0 };
  isScrolled = false;
  trailPositions: { x: number, y: number }[] = [];
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private animationFrame!: number;
  previewImage?: string;
  private lottieAnimation: any;

  @ViewChild('lottieContainer', { static: true }) lottieContainer!: ElementRef;

  // Your existing arrays
  projects: Project[] = [
    {
      id: 'project1', category: 'AI-Powered E-Commerce',
      title: 'Tail Cart (2025)',
      tech: 'Angular, Django, MySQL, Gemini AI, JWT, RBAC, AWS EC2, AWS RDS, Docker',
      desc: `Built and deployed a scalable pet e-commerce platform supporting 1,000+ concurrent users. Implemented JWT-based authentication, role-based access control, AI-powered pet health recommendations using Gemini AI, and optimized API performance to reduce response times by 35%. Deployed on AWS EC2 with RDS and Load Balancer for high availability.`,
      link: 'https://github.com/Gokulgopan01/Tail-Cart-frontend',
      visitLink: 'https://tailcart.vercel.app/',
      image: 'assets/images/Tail-cart.png'
    },
    {
      id: 'project2', category: 'Overseas Consultancy Platform',
      title: 'Solvers Global (2025)',
      tech: 'Angular, FastAPI, AioMySQL, JWT, RBAC, Alembic, Docker, AWS',
      desc: `Developed a scalable consultancy platform using Angular and FastAPI with a microservices-ready architecture. Implemented asynchronous APIs using FastAPI and AioMySQL, secured the platform with JWT authentication, role-based access control, and API rate limiting, and improved performance through caching, pagination, and lazy loading.`,
      link: '', visitLink: 'https://solversglobal.in', image: 'assets/images/solvers.png'
    },
    { id: 'project3', category: 'Enterprise Workflow Management', title: 'Work Track (2024)', tech: 'Django, Angular, MySQL, RxJS, Angular Material, RBAC', desc: `Built a role-based task management platform for monitoring employee progress and business workflows. Implemented CRUD operations, task analytics dashboards, role-based permissions, and real-time status tracking to improve operational efficiency.`, link: 'https://github.com/Gokulgopan01/Work-Track', visitLink: '', image: 'assets/images/Work_tracking.png' },
    {
      id: 'project3',
      category: 'Automation & ML',
      title: 'Stock Prediction Model',
      tech: 'Scikit-Learn, Pandas, Matplotlib, Django',
      desc: `A predictive analytics tool that leverages regression algorithms to forecast stock price movements. Includes automated data fetching and preprocessing.`,
      link: 'https://github.com/Gokulgopan01/Stock-AI',
      visitLink: '',
      image: '',
    },

    { id: 'project5', category: 'AI & E-Commerce', title: 'AI-Powered Shopping Cart', tech: 'Django, Angular, PostgreSQL, Gemini AI', desc: `Developed an AI-integrated e-commerce platform that allows users to generate custom outfit designs through text prompts. Implemented AI-powered recommendations, secure order management, and personalized shopping experiences.`, link: 'https://github.com/Gokulgopan01/Shopping_Cart', visitLink: '', image: 'assets/images/Shop_cart.png' }
  ];

  experiences: Experience[] = [
    {
      position: 'Software Engineer',
      company: 'Ecesis Technologies, Kerala, India',
      period: 'Mar 2024 – Present',
      description: `
• Designed and implemented secure RESTful APIs using FastAPI, ensuring JWT-based authentication and role-based access.
• Built and maintained CI/CD pipelines with Jenkins, automating deployments to AWS EC2 instances.
• Managed AWS resources including EC2, RDS, and S3 for scalable cloud infrastructure.
• Developed machine learning models for image recognition and data analytics, integrating with web applications.
• Mentored junior developers on coding standards, secure programming, and best practices.
• Applied Agile Scrum methodologies for project planning, sprint reviews, and continuous improvement.`
    },
    {
      position: 'Software Engineer Trainee',
      company: 'Ecesis Technologies, Kerala, India',
      period: 'Mar 2023 – Mar 2024',
      description: `
• Developed scalable web application architecture using Django and Angular.
• Designed and implemented secure REST APIs with proper validation and error handling.
• Conducted web scraping, automation, and data analysis using Python tools.
• Performed code reviews and optimized application performance for reliability and security.
• Collaborated in Agile teams, contributing to sprint planning and task prioritization.`
    },
    {
      position: 'Full Stack Intern',
      company: 'One Team Solutions, Kerala, India',
      period: 'Sep 2022 – Feb 2023',
      description: `
• Assisted in full-stack web application development using Django and Angular.
• Implemented CRUD operations and integrated MySQL/PostgreSQL databases.
• Developed responsive UI components and improved user experience with modern web technologies.
• Supported Agile project planning, unit testing, and deployment processes.`
    },
    {
      position: 'Computer Engineering Student',
      company: 'Govt College Neyyattinkara, Kerala, India',
      period: 'Jul 2019 – May 2022',
      description: `
• Learned core computer engineering concepts including databases, algorithms, and computer architecture.
• Built Arduino-based robotics projects demonstrating hardware-software integration.
• Gained proficiency in programming languages: Java, C++, HTML, CSS.
• Developed foundational skills in web development, database management, and system design.`
    }
  ];

  selectedProject: any = null;

  constructor(private snackBar: MatSnackBar) {
    this.checkMobileView();

    // Load saved theme, defaulting to dark if none exists
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      this.isDarkTheme = false;
      document.body.classList.remove('dark-theme');
    } else {
      // Default to dark or use existing 'dark' savedTheme
      this.isDarkTheme = true;
      document.body.classList.add('dark-theme');
    }
  }

  ngOnInit() {
    this.setupScrollTracking();
  }

  ngAfterViewInit() {
    this.initializeScrollAnimations();
    this.initializeParticles();
    this.initializeCodeBlock();
    this.initializeLottieAnimation();

    // Listen for orientation changes on mobile
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.resizeCanvas();
        // Reinitialize Lottie on orientation change
        if (this.lottieAnimation) {
          this.lottieAnimation.destroy();
          this.initializeLottieAnimation();
        }
      }, 100);
    });
  }

  // Initialize Lottie Animation
  initializeLottieAnimation() {
    if (this.lottieContainer && this.lottieContainer.nativeElement) {
      try {
        this.lottieAnimation = lottie.loadAnimation({
          container: this.lottieContainer.nativeElement,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: 'assets/hello_animation.json'
        });

        // Optional: Add event listeners
        this.lottieAnimation.addEventListener('DOMLoaded', () => {
          console.log('Lottie animation loaded successfully');
        });

        this.lottieAnimation.addEventListener('error', (error: any) => {
          console.error('Lottie animation error:', error);
          // Fallback to a simple icon if Lottie fails
          this.lottieContainer.nativeElement.innerHTML = '👋';
        });

      } catch (error) {
        console.error('Failed to load Lottie animation:', error);
        // Fallback
        this.lottieContainer.nativeElement.innerHTML = '👋';
      }
    }
  }

  setupScrollTracking() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.currentSection = entry.target.id;
          }
        });
      },
      {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
      }
    );

    this.sections.forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });
  }

  openImage(image?: string) {
    if (!image) return;
    this.previewImage = image;

    // Save current scroll position before locking
    const scrollY = window.scrollY;
    document.body.style.top = `-${scrollY}px`;

    // Apply modal styles
    document.body.classList.add('modal-open');
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
  }

  closeImage() {
    this.previewImage = undefined;

    // COMPLETELY reset all body styles
    const scrollY = Math.abs(parseInt(document.body.style.top || '0'));
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.height = '';
    document.body.style.top = '';
    document.body.classList.remove('modal-open');

    // Restore scroll position
    setTimeout(() => {
      window.scrollTo(0, scrollY);
    }, 10);
  }

  initializeParticles() {
    this.canvas = document.getElementById('particleCanvas') as HTMLCanvasElement;
    if (!this.canvas) {
      console.error('Canvas element not found');
      return;
    }

    this.ctx = this.canvas.getContext('2d')!;
    this.resizeCanvas();

    // Clear existing particles
    this.particles = [];

    // Create particles - dynamic count based on screen size to optimize rendering
    const particleCount = this.isMobile ? 25 : 60;
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        color: this.isDarkTheme ? '#a78bfa' : '#8b5cf6'
      });
    }

    this.animateParticles();
  }

  resizeCanvas() {
    if (!this.canvas) return;

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  animateParticles() {
    if (!this.ctx || !this.canvas) return;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw particles - SAME FOR MOBILE AND DESKTOP
    this.particles.forEach((particle, i) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

      // Apply mouse/touch repulsion - WORK ON BOTH
      const dx = this.mousePosition.x - particle.x;
      const dy = this.mousePosition.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        const force = (100 - distance) / 100;
        particle.vx -= dx * force * 0.01;
        particle.vy -= dy * force * 0.01;
      }

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color;
      this.ctx.fill();

      // Draw connections - SAME FOR MOBILE AND DESKTOP
      const maxDistance = 100;

      this.particles.slice(i + 1).forEach(otherParticle => {
        const dx = otherParticle.x - particle.x;
        const dy = otherParticle.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(otherParticle.x, otherParticle.y);
          const alpha = 0.2 * (1 - distance / maxDistance);
          this.ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      });
    });

    this.animationFrame = requestAnimationFrame(() => this.animateParticles());
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.pageYOffset > 50;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mousePosition.x = event.clientX;
    this.mousePosition.y = event.clientY;
  }


  initializeCodeBlock() {
    const tabs = document.querySelectorAll('.code-tab');
    const snippets = document.querySelectorAll(
      '.language-python, .language-typescript, .language-sql'
    );
    const runBtn = document.querySelector('.btn-run-code') as HTMLButtonElement;
    const outputBox = document.querySelector('.code-output') as HTMLElement;
    const outputContent = document.querySelector('.output-content') as HTMLElement;

    let currentLang = 'python';

    const outputs: Record<string, string[]> = {
      python: [
        'Starting backend services...',
        'REST APIs configured',
        'Authentication & authorization enabled',
        'Security measures applied',
        '🚀 Backend is live and running'
      ],
      typescript: [
        'Initializing frontend application...',
        'Components loaded successfully',
        'Event listeners attached',
        '✨ UI is responsive and interactive'
      ],
      sql: [
        'Initializing database...',
        'Relationships established',
        'Queries optimized',
        '📊 Database ready for operations'
      ]
    };

    // TAB SWITCHING
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        currentLang = tab.getAttribute('data-tab')!;

        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        snippets.forEach(snippet => {
          snippet.classList.remove('active');
          if (snippet.classList.contains(`language-${currentLang}`)) {
            snippet.classList.add('active');
          }
        });

        // Reset output on tab change
        outputBox.classList.add('hidden');
        outputContent.innerHTML = '';
      });
    });

    // RUN CODE
    runBtn.addEventListener('click', () => {
      outputContent.innerHTML = '';
      outputBox.classList.remove('hidden');

      const lines = outputs[currentLang];
      let index = 0;

      const typeLine = () => {
        if (index >= lines.length) return;

        const line = document.createElement('div');
        line.className = 'output-line';
        outputContent.appendChild(line);

        let charIndex = 0;
        const text = lines[index];

        const typing = setInterval(() => {
          if (charIndex < text.length) {
            line.textContent += text.charAt(charIndex);
            charIndex++;
          } else {
            clearInterval(typing);
            index++;
            setTimeout(typeLine, 300);
          }
        }, 40);
      };

      typeLine();
    });
  }


  // Don't forget to clean up
  ngOnDestroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    // Clean up Lottie animation
    if (this.lottieAnimation) {
      this.lottieAnimation.destroy();
    }
  }

  // Update getTechTags to handle different formats
  getTechTags(techString: string): string[] {
    return techString
      .split(/[,|]/)
      .map(t => t.trim())
      .slice(0, 5);   // 👈 change from 4 → 5
  }

  initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    setTimeout(() => {
      document.querySelectorAll('section').forEach(el => {
        observer.observe(el);
      });
    }, 100);
  }

  @HostListener('window:resize', [])
  onResize() {
    this.checkMobileView();
    this.resizeCanvas();
  }

  checkMobileView() {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      this.isMobileMenuOpen = false;
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;

    if (this.isDarkTheme) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.selectedProject) {
      this.closeProject();
    }
    if (event.key === 'Escape' && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  openProject(project: any) {
    this.selectedProject = project;
    document.body.style.overflow = 'hidden';
  }

  closeProject() {
    this.selectedProject = null;
    document.body.style.overflow = 'auto';
  }

  navigateToSection(sectionId: string) {
    this.currentSection = sectionId;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }



  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      this.mousePosition.x = touch.clientX;
      this.mousePosition.y = touch.clientY;
      this.updateParticlesOnTouch();
    }
  }

  // Update particles based on touch position
  updateParticlesOnTouch() {
    if (!this.particles || this.particles.length === 0) return;

    // Apply repulsion/attraction based on touch position
    this.particles.forEach(particle => {
      const dx = this.mousePosition.x - particle.x;
      const dy = this.mousePosition.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) { // Increase touch area for mobile
        const force = (150 - distance) / 150;
        particle.vx -= dx * force * 0.02; // Stronger effect for touch
        particle.vy -= dy * force * 0.02;

        // Limit velocity
        const maxSpeed = 3;
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (speed > maxSpeed) {
          particle.vx = (particle.vx / speed) * maxSpeed;
          particle.vy = (particle.vy / speed) * maxSpeed;
        }
      }
    });
  }

  submitForm() {
    this.sending = true;

    setTimeout(() => {
      this.sending = false;
      this.snackBar.open('Message sent successfully!', 'Close', {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });

      const form = document.querySelector('form') as HTMLFormElement;
      if (form) {
        form.reset();
      }
    }, 2000);
  }
}