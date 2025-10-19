import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';   
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';


interface Project {
  id: string;
  tech: string;
  category: string;
  title: string;
  desc: string;
  link: string;
  image?: string;
}

interface Skill {
  name: string;
  level: number;
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
  styleUrls: ['./home.component.css'],
  animations: [
    // Fade in each section on enter
    trigger('fadeInSection', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    
    // Staggered fade in for lists/items
    trigger('staggerFadeIn', [
      transition(':enter', [
        query(':self > *', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class HomeComponent {
  sections = ['personal-photo', 'about', 'skills', 'projects', 'experience', 'contact'];

  currentIndex = 0;
  sending = false;
  isMobile: boolean = false;
  isDarkTheme = false;

  skills: Skill[] = [
    { name: 'Python', level: 100 },
    { name: 'Django', level: 100 },
    { name: 'Angular', level: 90 },
    { name: 'FastAPI', level: 80 },
    { name: 'JavaScript/TypeScript', level: 85 },
    { name: 'MySQL', level: 100 },
    { name: 'PostgreSQL', level: 70 },
    { name: 'Machine Learning', level: 70 },
    { name: 'Git', level: 100 },
    { name: 'Jenkins', level: 80 },
    { name: 'AWS', level: 60 },
    { name: 'GCP', level: 60 }
  ];

  experiences: Experience[] = [
    {
      position: 'Software Engineer',
      company: 'Ecesis Technologies, Kerala, India',
      period: 'Mar 2023 – Present',
      description: `• Designed and implemented scalable software architecture for internal and client-based web applications.
    • Developed RESTful APIs using FastAPI and integrated services for data exchange.
    • Built and maintained CI/CD pipelines with Jenkins, streamlining automated deployments.
    • Conducted web scraping and crawling using Selenium, Playwright, and BeautifulSoup for data automation.
    • Optimized performance through debugging, code review, and security improvements.
    • Collaborated cross-functionally in Agile sprints with QA and product teams.
    • Mentored junior developers on Git workflows, best practices, and secure API design.
    • Authored detailed technical documentation to support project onboarding and maintenance.`
    },
    {
      position: 'Full Stack Intern',
      company: 'One Team Solutions, Kerala, India',
      period: 'Sep 2022 – Feb 2023',
      description: `• Assisted in full-stack application development using Django and Angular.
    • Designed responsive interfaces using HTML, CSS, JavaScript, and AJAX.
    • Implemented CRUD operations and database integration with MySQL.
    • Supported Agile project planning and testing activities for feature delivery.`
    }
  ];

  projects: Project[] = [
    {
      id: 'project1',
      category: 'Full-Stack Development',
      title: 'Pet Safe (2025)',
      tech: 'Django, Angular, MySQL',
      desc: `A secure, full-stack platform for pet owners to manage and share pet details.
    Includes health record uploads, digital vaccination tracking, and QR-enabled keychains for lost-and-found identification.
    The platform emphasizes scalability, data security, and a smooth user experience.`,
      link: 'https://github.com/Gokulgopan01',
      image: 'assets/images/pet_safe.png',
    },
    {
      id: 'project2',
      category: 'Web Application',
      title: 'Work Track (2024)',
      tech: 'Django, Angular, MySQL, MatSnackBar, SweetAlert',
      desc: `A role-based task management dashboard for monitoring employee progress.
    Features include CRUD operations, task status analytics, and access control layers for admin, manager, and staff roles.
    Integrated notification system using SweetAlert and real-time updates.`,
      link: 'https://github.com/Gokulgopan01',
      image: '/assets/images/Work_track.png',
    },
    {
      id: 'project3',
      category: 'Automation & ML',
      title: 'Stock Prediction Model',
      tech: 'Scikit-Learn, Pandas, Matplotlib, Django',
      desc: `A predictive analytics tool that leverages regression algorithms to forecast stock price movements.
    Includes automated data fetching, preprocessing, and visualization dashboards built with Django.`,
      link: 'https://github.com/Gokulgopan01',
    },
    {
      id: 'project4',
      category: 'AI & E-Commerce',
      title: 'AI-Powered Shopping Cart',
      tech: 'Django, Angular, PostgreSQL, Gemini-AI',
      desc: `An AI-integrated e-commerce system where users can generate custom outfit designs through text prompts.
    Includes product recommendation, order tracking, and secure online checkout modules.`,
      link: 'https://github.com/Gokulgopan01/Shopping_Cart',
      image: '/assets/images/Shop_cart.png',
    }
  ];

  selectedProject: any = null;

  constructor(private snackBar: MatSnackBar) {
    this.checkMobileView();
  }

  

  @HostListener('window:resize', [])
  onResize() {
    this.checkMobileView();

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkTheme = true;
      document.body.classList.add('dark-theme');
    }
  }

  checkMobileView() {
    this.isMobile = window.innerWidth <= 720;
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
    // Only handle keyboard navigation if not on mobile
    if (!this.isMobile) {
      if (event.key === 'ArrowRight') {
        this.scrollNext();
      } else if (event.key === 'ArrowLeft') {
        this.scrollPrev();
      } else if (event.key === 'Escape' && this.selectedProject) {
        this.closeProject();
      }
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

  scrollNext(): void {
    // Only scroll horizontally if not on mobile
    if (!this.isMobile) {
      if (this.currentIndex < this.sections.length - 1) {
        this.currentIndex++;
      } else {
        this.currentIndex = 0;
      }
    }
  }

  scrollPrev(): void {
    // Only scroll horizontally if not on mobile
    if (!this.isMobile) {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      } else {
        this.currentIndex = this.sections.length - 1;
      }
    }
  }

  // Navigation from navbar - only update currentIndex for active styling
  navigateToSection(index: number) {
    this.currentIndex = index;
    
    // If on mobile, scroll to the section
    if (this.isMobile) {
      const sectionId = this.sections[index];
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  getSkillColor(level: number): string {
    if (level >= 90) return '#a8e7a8'; 
    if (level >= 80) return '#7ec8e3'; 
    if (level >= 70) return '#ffd166'; 
    return '#ff6b6b'; 
  }

  submitForm() {
    this.sending = true;

    setTimeout(() => {
      this.sending = false;
      this.snackBar.open('Message sent successfully to Gokul!', 'Close', {
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