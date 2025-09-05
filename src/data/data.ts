import { TChatMessage, THelpCollection, TNews } from "../types/types";

export const homeData = [
  {
    id: 1,
    title: "A new era of Insights has arrived",
    description:
      "We announced Fin Insights, a groundbreaking, AI-powered product that gives you complete visibility into every customer conversation, with AI-powered tools and suggestions that help you monitor, analyze, and instantly optimize your customer service quality. Watch the event on-demand.",
    image:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop",
    link: "https://www.google.com",
  },
  {
    id: 2,
    title: "Advanced AI Features Released",
    description:
      "Discover our latest AI-powered features that revolutionize customer service. Get real-time insights, automated responses, and intelligent analytics to enhance your customer experience.",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop",
    link: "https://www.google.com",
  },
  {
    id: 3,
    title: "Customer Success Stories",
    description:
      "Read how our customers have transformed their business operations using our innovative solutions. Learn from real case studies and success metrics.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
    link: "https://www.google.com",
  },
  {
    id: 4,
    title: "Product Updates & Roadmap",
    description:
      "Stay updated with our latest product releases, feature updates, and upcoming roadmap. Be the first to know about new capabilities and improvements.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    link: "https://www.google.com",
  },
];

export const chatHistoryData = [
  {
    id: 1,
    title: "Account Setup Help",
    timestamp: "2:30 PM",
    day: "Today",
  },
  {
    id: 2,
    title: "Feature Request Discussion",
    timestamp: "11:45 AM",
    day: "Today",
  },
  {
    id: 3,
    title: "Bug Report - Login Issue",
    timestamp: "9:15 AM",
    day: "Yesterday",
  },
  {
    id: 4,
    title: "Product Pricing Questions",
    timestamp: "4:20 PM",
    day: "Yesterday",
  },
  {
    id: 5,
    title: "Technical Support - API Integration",
    timestamp: "3:10 PM",
    day: "Monday",
  },
];

export const helpData: THelpCollection[] = [
  {
    id: 1,
    title: "Intercom Overview",
    description: "See how your AI-first customer service solution works.",
    articles: [
      {
        id: 1,
        title: "What is Intercom?",
        description:
          "How Intercom works, what it can do for your business, and what makes it different from other solutions.",
        author: "Beth-Ann Sher",
        lastUpdated: "Updated over 2 months ago",
        readTime: "5 min read",
        tableOfContents: [
          "Introduction",
          "Key Features",
          "Benefits",
          "Getting Started",
        ],
        content: `
          <p>The Intercom Customer Service Suite combines the #1 AI agent for customer support with a next-gen Helpdesk—built on a single platform that maximizes team efficiency and delivers superior service.</p>
          
          <ul>
            <li><strong>Agents</strong> work smarter and faster, reducing time to resolution and increasing their service quality.</li>
            <li><strong>Support leaders</strong> see increased scale, efficiency, and operational savings—cutting hundreds of hours and thousands of dollars in support costs each month.</li>
            <li><strong>Customers</strong> receive faster, smoother, more personalized service—ultimately leading to increased customer satisfaction (CSAT) and loyalty.</li>
          </ul>
          
          <div class="dashboard-overview">
            <h3>Dashboard Overview</h3>
            <p>Access your unified inbox, manage conversations, and track performance metrics all from one central dashboard.</p>
          </div>
          
          <p>Learn more about our refund policy for subscription cancellations and how to manage your account settings.</p>
        `,
      },
      {
        id: 2,
        title: "Intercom features explained",
        description: "Discover all the powerful features available in Intercom",
        author: "Mike Chen",
        lastUpdated: "Updated 1 month ago",
        readTime: "8 min read",
        tableOfContents: [
          "Core Features",
          "AI Capabilities",
          "Integration Options",
          "Analytics",
        ],
        content: `
          <p>Intercom offers a comprehensive suite of customer service tools designed to help businesses provide exceptional support experiences.</p>
          
          <h3>Core Features</h3>
          <ul>
            <li><strong>Unified Inbox:</strong> Manage all customer conversations from one central location</li>
            <li><strong>Live Chat:</strong> Real-time messaging with customers on your website</li>
            <li><strong>Email Support:</strong> Professional email management with templates and automation</li>
            <li><strong>Knowledge Base:</strong> Self-service articles to reduce support volume</li>
          </ul>
          
          <h3>AI Capabilities</h3>
          <p>Our AI agent, Fin, can handle common questions automatically, freeing up your team for complex issues.</p>
          
          <h3>Integration Options</h3>
          <p>Connect Intercom with over 200+ tools including CRM systems, analytics platforms, and productivity apps.</p>
        `,
      },
      {
        id: 3,
        title: "The Intercom Glossary",
        description: "Common terms and definitions used throughout Intercom",
        author: "Sarah Johnson",
        lastUpdated: "Updated 3 weeks ago",
        readTime: "3 min read",
        tableOfContents: [
          "A-C",
          "D-F",
          "G-I",
          "J-L",
          "M-O",
          "P-R",
          "S-U",
          "V-Z",
        ],
        content: `
          <p>This glossary contains definitions for common terms used throughout Intercom's platform and documentation.</p>
          
          <h3>A-C</h3>
          <ul>
            <li><strong>Agent:</strong> A team member who responds to customer conversations</li>
            <li><strong>Article:</strong> A help document in your knowledge base</li>
            <li><strong>Bot:</strong> An automated response system for common questions</li>
            <li><strong>Conversation:</strong> A customer interaction thread</li>
          </ul>
          
          <h3>D-F</h3>
          <ul>
            <li><strong>Dashboard:</strong> The main interface for managing conversations and analytics</li>
            <li><strong>Fin:</strong> Intercom's AI-powered customer service agent</li>
            <li><strong>First Response Time:</strong> Time taken to send the first reply to a customer</li>
          </ul>
          
          <h3>G-I</h3>
          <ul>
            <li><strong>Inbox:</strong> Central location for all customer conversations</li>
            <li><strong>Integration:</strong> Connection between Intercom and external tools</li>
          </ul>
        `,
      },
      {
        id: 4,
        title: "How we measure SLA adherence at Intercom",
        description: "Understanding service level agreements and metrics",
        author: "Beth-Ann Sher",
        lastUpdated: "Updated 2 weeks ago",
        readTime: "6 min read",
      },
      {
        id: 5,
        title: "Getting started with Intercom",
        description: "Step-by-step guide to set up your Intercom workspace",
      },
      {
        id: 6,
        title: "Understanding the Intercom dashboard",
        description: "Navigate and customize your Intercom dashboard",
      },
      {
        id: 7,
        title: "Intercom best practices",
        description: "Tips and tricks to get the most out of Intercom",
      },
      {
        id: 8,
        title: "Intercom vs competitors",
        description:
          "How Intercom compares to other customer service platforms",
      },
      {
        id: 9,
        title: "Intercom security overview",
        description: "Learn about Intercom's security measures and compliance",
      },
      {
        id: 10,
        title: "Intercom mobile app guide",
        description: "Using Intercom on your mobile devices",
      },
      {
        id: 11,
        title: "Intercom integrations overview",
        description: "Connect Intercom with your favorite tools",
      },
      {
        id: 12,
        title: "Intercom analytics and reporting",
        description: "Track performance with Intercom's analytics tools",
      },
      {
        id: 13,
        title: "Intercom automation features",
        description: "Automate your customer service workflows",
      },
      {
        id: 14,
        title: "Intercom team collaboration",
        description: "Work together effectively with your team in Intercom",
      },
      {
        id: 15,
        title: "Intercom customer success stories",
        description: "Real examples of businesses using Intercom successfully",
      },
      {
        id: 16,
        title: "Intercom pricing explained",
        description: "Understanding Intercom's pricing structure and plans",
      },
      {
        id: 17,
        title: "Intercom API documentation",
        description: "Technical guide to Intercom's API capabilities",
      },
      {
        id: 18,
        title: "Intercom data export and backup",
        description: "How to export and backup your Intercom data",
      },
      {
        id: 19,
        title: "Intercom customization options",
        description: "Customize Intercom to match your brand and workflow",
      },
      {
        id: 20,
        title: "Intercom troubleshooting guide",
        description: "Common issues and how to resolve them",
      },
      {
        id: 21,
        title: "Intercom training resources",
        description: "Educational materials to help your team learn Intercom",
      },
      {
        id: 22,
        title: "Intercom community and support",
        description: "Get help from the Intercom community and support team",
      },
      {
        id: 23,
        title: "Intercom roadmap and updates",
        description:
          "Stay updated with Intercom's latest features and improvements",
      },
    ],
    author: "Beth-Ann",
    authorCount: 3,
  },
  {
    id: 2,
    title: "Getting Started",
    description: "Everything you need to know to get started with Intercom.",
    articles: [
      {
        id: 24,
        title: "Setting up your Intercom workspace",
        description: "Initial setup and configuration steps",
      },
      {
        id: 25,
        title: "Creating your first team",
        description: "How to add team members and set permissions",
      },
      {
        id: 26,
        title: "Installing Intercom on your website",
        description: "Add Intercom to your website or app",
      },
      {
        id: 27,
        title: "Configuring your first bot",
        description: "Set up automated responses and workflows",
      },
      {
        id: 28,
        title: "Setting up email notifications",
        description: "Configure email alerts and notifications",
      },
      {
        id: 29,
        title: "Creating your first article",
        description: "Build your knowledge base with help articles",
      },
      {
        id: 30,
        title: "Setting up custom fields",
        description: "Add custom data fields to track customer information",
      },
      {
        id: 31,
        title: "Configuring integrations",
        description: "Connect Intercom with your existing tools",
      },
      {
        id: 32,
        title: "Setting up reporting",
        description: "Configure analytics and performance tracking",
      },
      {
        id: 33,
        title: "Training your team",
        description: "Get your team up to speed with Intercom",
      },
      {
        id: 34,
        title: "Best practices for new users",
        description: "Tips for getting the most out of Intercom from day one",
      },
      {
        id: 35,
        title: "Common setup mistakes to avoid",
        description: "Learn from common configuration errors",
      },
      {
        id: 36,
        title: "Setting up your first campaign",
        description: "Create and launch your first customer campaign",
      },
      {
        id: 37,
        title: "Configuring user roles and permissions",
        description: "Set up proper access controls for your team",
      },
      {
        id: 38,
        title: "Setting up data sync",
        description: "Sync customer data from your existing systems",
      },
      {
        id: 39,
        title: "Configuring mobile notifications",
        description: "Set up push notifications for mobile apps",
      },
      {
        id: 40,
        title: "Setting up webhooks",
        description: "Configure real-time data updates",
      },
      {
        id: 41,
        title: "Creating your first survey",
        description: "Build and deploy customer feedback surveys",
      },
      {
        id: 42,
        title: "Setting up conversation routing",
        description: "Configure how conversations are assigned to team members",
      },
      {
        id: 43,
        title: "Configuring business hours",
        description: "Set up your support availability and auto-responses",
      },
      {
        id: 44,
        title: "Setting up escalation rules",
        description: "Configure when and how to escalate conversations",
      },
      {
        id: 45,
        title: "Creating your first template",
        description: "Build reusable message templates",
      },
      {
        id: 46,
        title: "Setting up customer segments",
        description: "Organize customers into meaningful groups",
      },
      {
        id: 47,
        title: "Configuring conversation tags",
        description: "Set up tags to organize and track conversations",
      },
      {
        id: 48,
        title: "Setting up performance metrics",
        description: "Define and track key performance indicators",
      },
      {
        id: 49,
        title: "Creating your first automation",
        description: "Set up automated workflows to save time",
      },
      {
        id: 50,
        title: "Setting up customer satisfaction tracking",
        description: "Monitor and improve customer satisfaction",
      },
      {
        id: 51,
        title: "Configuring multi-language support",
        description: "Set up support for multiple languages",
      },
      {
        id: 52,
        title: "Setting up your first integration",
        description: "Connect Intercom with your CRM or other tools",
      },
    ],
    author: "Sarah",
    authorCount: 2,
  },
  {
    id: 3,
    title: "Fin AI Agent",
    description:
      "Resolving customer questions instantly and accurately—from live chat to email.",
    articles: [
      {
        id: 53,
        title: "What is Fin AI Agent?",
        description:
          "Introduction to Intercom's AI-powered customer service agent",
      },
      {
        id: 54,
        title: "Setting up Fin AI Agent",
        description: "Configure and deploy your AI agent",
      },
      {
        id: 55,
        title: "Training your Fin AI Agent",
        description:
          "Teach your AI agent to handle customer queries effectively",
      },
      {
        id: 56,
        title: "Fin AI Agent best practices",
        description: "Tips for optimizing your AI agent's performance",
      },
      {
        id: 57,
        title: "Monitoring Fin AI Agent performance",
        description: "Track and analyze your AI agent's effectiveness",
      },
      {
        id: 58,
        title: "Customizing Fin AI Agent responses",
        description: "Personalize your AI agent's communication style",
      },
      {
        id: 59,
        title: "Fin AI Agent conversation flows",
        description: "Design effective conversation paths for your AI agent",
      },
      {
        id: 60,
        title: "Integrating Fin AI Agent with your knowledge base",
        description: "Connect your AI agent to your help articles",
      },
      {
        id: 61,
        title: "Fin AI Agent escalation rules",
        description: "Configure when to transfer to human agents",
      },
      {
        id: 62,
        title: "Fin AI Agent analytics and insights",
        description: "Understand your AI agent's performance metrics",
      },
      {
        id: 63,
        title: "Fin AI Agent troubleshooting",
        description: "Common issues and solutions for AI agent problems",
      },
      {
        id: 64,
        title: "Fin AI Agent security and privacy",
        description: "Ensure your AI agent handles data securely",
      },
      {
        id: 65,
        title: "Fin AI Agent multilingual support",
        description: "Set up your AI agent to handle multiple languages",
      },
      {
        id: 66,
        title: "Fin AI Agent conversation history",
        description: "Review and analyze past AI agent conversations",
      },
      {
        id: 67,
        title: "Fin AI Agent response templates",
        description: "Create and manage AI agent response templates",
      },
      {
        id: 68,
        title: "Fin AI Agent testing and optimization",
        description: "Test and improve your AI agent's responses",
      },
      {
        id: 69,
        title: "Fin AI Agent integration with CRM",
        description:
          "Connect your AI agent to your customer relationship management system",
      },
      {
        id: 70,
        title: "Fin AI Agent conversation routing",
        description: "Configure how conversations are handled by your AI agent",
      },
      {
        id: 71,
        title: "Fin AI Agent customer satisfaction",
        description:
          "Measure and improve customer satisfaction with AI interactions",
      },
      {
        id: 72,
        title: "Fin AI Agent compliance and regulations",
        description:
          "Ensure your AI agent meets industry compliance requirements",
      },
      {
        id: 73,
        title: "Fin AI Agent advanced features",
        description:
          "Explore advanced AI agent capabilities and configurations",
      },
      {
        id: 74,
        title: "Fin AI Agent team collaboration",
        description: "How human agents work alongside your AI agent",
      },
      {
        id: 75,
        title: "Fin AI Agent performance tuning",
        description: "Optimize your AI agent for better results",
      },
      {
        id: 76,
        title: "Fin AI Agent conversation analytics",
        description: "Deep dive into conversation patterns and insights",
      },
      {
        id: 77,
        title: "Fin AI Agent customer feedback integration",
        description: "Incorporate customer feedback to improve AI responses",
      },
      {
        id: 78,
        title: "Fin AI Agent deployment strategies",
        description: "Best practices for rolling out your AI agent",
      },
      {
        id: 79,
        title: "Fin AI Agent maintenance and updates",
        description: "Keep your AI agent running smoothly and up-to-date",
      },
      {
        id: 80,
        title: "Fin AI Agent cost optimization",
        description: "Manage costs while maximizing AI agent effectiveness",
      },
      {
        id: 81,
        title: "Fin AI Agent conversation quality assurance",
        description: "Ensure consistent quality in AI agent interactions",
      },
      {
        id: 82,
        title: "Fin AI Agent integration with ticketing systems",
        description: "Connect your AI agent to existing ticketing workflows",
      },
      {
        id: 83,
        title: "Fin AI Agent conversation context",
        description: "How your AI agent maintains conversation context",
      },
      {
        id: 84,
        title: "Fin AI Agent response personalization",
        description: "Personalize AI responses based on customer data",
      },
      {
        id: 85,
        title: "Fin AI Agent conversation handoff",
        description: "Smooth transitions between AI and human agents",
      },
      {
        id: 86,
        title: "Fin AI Agent conversation recording",
        description: "Record and review AI agent conversations for improvement",
      },
      {
        id: 87,
        title: "Fin AI Agent conversation sentiment analysis",
        description: "Analyze customer sentiment in AI interactions",
      },
      {
        id: 88,
        title: "Fin AI Agent conversation intent recognition",
        description: "How your AI agent understands customer intent",
      },
      {
        id: 89,
        title: "Fin AI Agent conversation escalation triggers",
        description:
          "Configure automatic escalation based on conversation context",
      },
      {
        id: 90,
        title: "Fin AI Agent conversation follow-up",
        description: "Set up automated follow-up conversations",
      },
      {
        id: 91,
        title: "Fin AI Agent conversation scheduling",
        description: "Schedule AI agent availability and responses",
      },
      {
        id: 92,
        title: "Fin AI Agent conversation prioritization",
        description: "Prioritize conversations based on urgency and importance",
      },
      {
        id: 93,
        title: "Fin AI Agent conversation routing rules",
        description: "Advanced routing logic for AI agent conversations",
      },
      {
        id: 94,
        title: "Fin AI Agent conversation analytics dashboard",
        description: "Visualize AI agent performance with custom dashboards",
      },
      {
        id: 95,
        title: "Fin AI Agent conversation A/B testing",
        description:
          "Test different AI agent approaches to optimize performance",
      },
      {
        id: 96,
        title: "Fin AI Agent conversation feedback loops",
        description: "Implement feedback mechanisms to improve AI responses",
      },
      {
        id: 97,
        title: "Fin AI Agent conversation data export",
        description: "Export AI agent conversation data for analysis",
      },
      {
        id: 98,
        title: "Fin AI Agent conversation backup and recovery",
        description: "Backup and restore AI agent conversation data",
      },
      {
        id: 99,
        title: "Fin AI Agent conversation compliance reporting",
        description: "Generate compliance reports for AI agent interactions",
      },
      {
        id: 100,
        title: "Fin AI Agent conversation performance benchmarking",
        description:
          "Compare your AI agent performance against industry standards",
      },
      {
        id: 101,
        title: "Fin AI Agent conversation optimization strategies",
        description: "Advanced strategies for improving AI agent effectiveness",
      },
      {
        id: 102,
        title: "Fin AI Agent conversation integration APIs",
        description: "Technical integration options for AI agent conversations",
      },
      {
        id: 103,
        title: "Fin AI Agent conversation workflow automation",
        description: "Automate complex workflows with your AI agent",
      },
      {
        id: 104,
        title: "Fin AI Agent conversation quality metrics",
        description: "Define and track quality metrics for AI interactions",
      },
      {
        id: 105,
        title: "Fin AI Agent conversation training data",
        description: "Manage and improve training data for your AI agent",
      },
      {
        id: 106,
        title: "Fin AI Agent conversation error handling",
        description: "Handle errors and edge cases in AI agent conversations",
      },
      {
        id: 107,
        title: "Fin AI Agent conversation user experience",
        description: "Optimize the user experience of AI agent interactions",
      },
      {
        id: 108,
        title: "Fin AI Agent conversation scalability",
        description: "Scale your AI agent to handle high conversation volumes",
      },
    ],
    author: "Mike",
    authorCount: 4,
  },
];

export const initialChatMessages: TChatMessage[] = [
  {
    id: 1,
    text: "Hello! How can I help you today?",
    isUser: false,
    timestamp: "10:30 AM",
  },
  {
    id: 2,
    text: "I need help with my account",
    isUser: true,
    timestamp: "10:31 AM",
  },
  {
    id: 3,
    text: "I'd be happy to help! What specific issue are you facing?",
    isUser: false,
    timestamp: "10:32 AM",
  },
];
