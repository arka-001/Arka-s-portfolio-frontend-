// src/api/index.ts (No changes needed for WhatsApp functionality)

// The API_BASE_URL is now pointing to your live PythonAnywhere server
const API_BASE_URL = 'https://arka001.pythonanywhere.com/api';

// Your improved fetch function that handles pagination
const fetchData = async (url: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`);
    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json();
    
    // Handle Django REST framework paginated response
    if (data && data.results && Array.isArray(data.results)) {
      return data.results; // Return the results array
    }
    
    // Handle direct array response (like your /hero/ endpoint)
    if (Array.isArray(data)) {
      return data;
    }
    
    return []; // Return empty array if format is unexpected
    
  } catch (error) {
    console.log(`API error for ${url} - using fallback data`);
    return []; // Return empty array on error so .length doesn't fail
  }
};

// This function handles the form submission and error response
const submitContactForm = async (formData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contact/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const error: any = new Error('An error occurred while submitting the form.');
        error.response = response; 
        throw error;
      }
      return await response.json();
    } catch (error) {
      throw error; 
    }
};

// Export all API functions together
export const apiService = {
  getHero: async () => {
    const data = await fetchData('/hero/');
    return data.length > 0 ? data[0] : {
      name: "Arka Maitra",
      tagline: "Full-Stack Software Engineer",
      description: "Crafting digital experiences with modern web technologies.",
      resume_url: "#",
      contact_email: "your.email@example.com"
    };
  },

  getAbout: async () => {
    const data = await fetchData('/about/');
    return data.length > 0 ? data[0] : {
      name: "Arka Maitra",
      title: "Full Stack Developer & UI/UX Designer",
      description: "I'm a passionate Full Stack Developer with expertise in modern web technologies.",
      profile_image_url: "https://via.placeholder.com/400",
      email: "your.email@example.com",
      phone: "+1 234 567 890", // This is your fallback phone number
      location: "City, Country",
      github: "https://github.com/arka-001",
      linkedin: "#",
      twitter: "#",
      website: "#",
      resume: "#",
    };
  },

  getSkills: async () => {
    const data = await fetchData('/skills/');
    return data.length > 0 ? data : [
        { name: "Django & DRF", proficiency: 95, color: "#092E20" },
        { name: "React & Next.js", proficiency: 90, color: "#61DAFB" },
    ];
  },

  getProjects: async () => {
    const data = await fetchData('/projects/');
    return data.length > 0 ? data : [
      {
        id: 1,
        title: "E-Commerce Platform (Fallback)",
        short_description: "Modern e-commerce platform with Django backend and React frontend.",
        project_type_display: "Web Application",
        technologies: [ { "name": "DRF" }, { "name": "JavaScript" } ],
        image_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop",
        github_url: "#",
        live_url: "#",
      }
    ];
  },
  
  getEducation: async () => {
    const data = await fetchData('/education/');
    return data.length > 0 ? data : [
      {
        id: 1,
        institution: "Indian Institute of Technology",
        degree: "Bachelor of Technology",
        field_of_study: "Computer Science and Engineering",
        start_date: "2015-08-01",
        end_date: "2019-05-31",
        description: "Graduated with honors."
      }
    ];
  },
  
  getServices: async () => {
    const data = await fetchData('/services/');
    return data.length > 0 ? data : [
      { id: 1, title: "Web Development", description: "Full-stack web development.", icon: "fas fa-code" },
      { id: 2, title: "Mobile App Development", description: "Cross-platform mobile apps.", icon: "fas fa-mobile-alt" },
    ];
  },

  getTestimonials: async () => {
    const data = await fetchData('/testimonials/');
    return data.length > 0 ? data : [
      { id: 1, name: "Sarah Johnson", position: "Project Manager", company: "Tech Solutions Inc.", content: "An exceptional developer.", image: null },
    ];
  },

  getBlogPosts: async () => {
    const data = await fetchData('/blog/');
    return data.length > 0 ? data : [
      { id: 1, title: "Getting Started with DRF", slug: "getting-started-drf", excerpt: "Learn how to build powerful APIs.", published_at: "2025-08-23T16:13:52Z" },
    ];
  },

  submitContact: submitContactForm,
};
