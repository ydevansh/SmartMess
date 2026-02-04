import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import {
  FiArrowRight,
  FiStar,
  FiCalendar,
  FiSmartphone,
  FiCheckCircle,
  FiUsers,
  FiTrendingUp,
  FiClock,
  FiMessageSquare,
  FiShield,
  FiChevronDown,
} from "react-icons/fi";
import Button from "../components/ui/Button";
import styles from "./Landing.module.css";

const Landing = () => {
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [animatedStats, setAnimatedStats] = useState({ students: 0, ratings: 0, meals: 0 });

  // Animate stats on load
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const targets = { students: 500, ratings: 2500, meals: 150 };
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setAnimatedStats({
        students: Math.floor(targets.students * progress),
        ratings: Math.floor(targets.ratings * progress),
        meals: Math.floor(targets.meals * progress),
      });
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const features = [
    {
      icon: FiCalendar,
      title: "Daily & Weekly Menus",
      description: "Check today's breakfast, lunch, snacks & dinner. Plan your week ahead with the full weekly menu view.",
      color: "#4F46E5",
    },
    {
      icon: FiStar,
      title: "Rate Every Meal",
      description: "Give 1-5 star ratings with comments. Your honest feedback helps the mess improve quality.",
      color: "#F59E0B",
    },
    {
      icon: FiTrendingUp,
      title: "Track Your History",
      description: "See all your past ratings and attendance. Know which meals you loved and which need improvement.",
      color: "#10B981",
    },
    {
      icon: FiSmartphone,
      title: "Works Everywhere",
      description: "Access from phone, tablet or computer. The app adapts perfectly to any screen size.",
      color: "#EC4899",
    },
    {
      icon: FiClock,
      title: "Real-Time Updates",
      description: "Menu changes instantly reflect. No more walking to mess only to find today's special changed!",
      color: "#8B5CF6",
    },
    {
      icon: FiShield,
      title: "Secure & Private",
      description: "Your data is safe with us. Only you and mess admins can see your ratings and feedback.",
      color: "#06B6D4",
    },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Create Account",
      description: "Sign up with your college email in just 30 seconds. No verification hassle!",
      icon: FiUsers,
    },
    {
      step: "02",
      title: "Check Today's Menu",
      description: "Open the app to see what's cooking for breakfast, lunch, snacks, and dinner.",
      icon: FiCalendar,
    },
    {
      step: "03",
      title: "Rate Your Meal",
      description: "After eating, rate the meal from 1-5 stars. Add comments if you want.",
      icon: FiStar,
    },
    {
      step: "04",
      title: "Help Improve",
      description: "Your ratings help mess staff know what students like. Better food for everyone!",
      icon: FiTrendingUp,
    },
  ];

  const testimonials = [
    {
      name: "Rahul S.",
      role: "B.Tech CSE",
      text: "Finally I can see what's for lunch before going to mess. Saves so much time!",
      rating: 5,
    },
    {
      name: "Priya M.",
      role: "M.Sc Physics",
      text: "Love the rating system. Mess food has actually improved since we started using this app.",
      rating: 5,
    },
    {
      name: "Amit K.",
      role: "B.Tech ECE",
      text: "Super easy to use. I rate my meals daily now. The weekly menu view is really helpful.",
      rating: 4,
    },
  ];

  const faqs = [
    {
      question: "Is SmartMess free to use?",
      answer: "Yes! SmartMess is completely free for all students. No hidden charges, no premium plans.",
    },
    {
      question: "Can I see the menu without logging in?",
      answer: "You need to create a free account to view menus and rate meals. It takes only 30 seconds!",
    },
    {
      question: "Will mess staff see my ratings?",
      answer: "Yes, mess admins can see overall ratings and feedback to improve food quality. Your individual identity remains private.",
    },
    {
      question: "Can I change my rating later?",
      answer: "Yes! You can update or delete your ratings anytime from the 'My Ratings' section.",
    },
  ];

  const menuPreview = [
    { time: "Breakfast", items: ["🥛 Milk", "🍞 Bread", "🧈 Butter", "🥚 Omelette"], rating: 4.2 },
    { time: "Lunch", items: ["🍚 Rice", "🍛 Dal", "🥗 Salad", "🍛 Paneer"], rating: 4.5 },
    { time: "Snacks", items: ["☕ Tea", "🍪 Biscuits", "🍌 Banana"], rating: 3.8 },
    { time: "Dinner", items: ["🍚 Rice", "🍲 Curry", "🥒 Raita", "🍨 Sweet"], rating: 4.0 },
  ];

  return (
    <div className={styles.landing}>
      {/* Navigation */}
      <header className={styles.header}>
        <nav className={styles.nav}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🍽️</span>
            <span className={styles.logoText}>SmartMess</span>
          </div>
          <div className={styles.navLinks}>
            <a href="#features" className={styles.navLink}>Features</a>
            <a href="#how-it-works" className={styles.navLink}>How It Works</a>
            <a href="#faq" className={styles.navLink}>FAQ</a>
            <Link to="/login">
              <Button variant="ghost" size="small">Login</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="small">Sign Up Free</Button>
            </Link>
          </div>
          <button className={styles.mobileMenuBtn}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroBubble1}></div>
          <div className={styles.heroBubble2}></div>
          <div className={styles.heroBubble3}></div>
        </div>
        
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <div className={styles.badge}>
              <FiCheckCircle /> Trusted by 500+ Students
            </div>
            <h1 className={styles.heroTitle}>
              Know What's Cooking
              <span className={styles.highlight}> Before You Go!</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Stop walking to mess blindly! Check daily menus, rate your meals, 
              and help make hostel food better for everyone. It's free and takes 30 seconds to start.
            </p>
            <div className={styles.heroCta}>
              <Link to="/register">
                <Button size="large" icon={FiArrowRight} iconPosition="right">
                  Get Started — It's Free
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="outline" size="large">
                  See How It Works
                </Button>
              </a>
            </div>
            <div className={styles.heroTrust}>
              <div className={styles.avatarGroup}>
                <div className={styles.avatar}>👩‍🎓</div>
                <div className={styles.avatar}>👨‍🎓</div>
                <div className={styles.avatar}>👩‍💻</div>
                <div className={styles.avatar}>👨‍💻</div>
              </div>
              <span>Join 500+ students already using SmartMess</span>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.phoneFrame}>
              <div className={styles.phoneNotch}></div>
              <div className={styles.phoneScreen}>
                <div className={styles.menuTabs}>
                  {menuPreview.map((menu, idx) => (
                    <button
                      key={idx}
                      className={`${styles.menuTab} ${activeTab === idx ? styles.activeTab : ''}`}
                      onClick={() => setActiveTab(idx)}
                    >
                      {menu.time}
                    </button>
                  ))}
                </div>
                <div className={styles.menuContent}>
                  <div className={styles.menuHeader}>
                    <h3>{menuPreview[activeTab].time}</h3>
                    <span className={styles.menuRating}>
                      ⭐ {menuPreview[activeTab].rating}
                    </span>
                  </div>
                  <div className={styles.menuItems}>
                    {menuPreview[activeTab].items.map((item, idx) => (
                      <div key={idx} className={styles.menuItem} style={{ animationDelay: `${idx * 0.1}s` }}>
                        {item}
                      </div>
                    ))}
                  </div>
                  <button className={styles.rateBtn}>
                    <FiStar /> Rate This Meal
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.floatingCard1}>
              <FiStar className={styles.floatingIcon} />
              <span>+25 ratings today</span>
            </div>
            <div className={styles.floatingCard2}>
              <FiCheckCircle className={styles.floatingIcon} />
              <span>Menu updated!</span>
            </div>
          </div>
        </div>

        <a href="#stats" className={styles.scrollDown}>
          <FiChevronDown />
        </a>
      </section>

      {/* Stats Section */}
      <section id="stats" className={styles.stats}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{animatedStats.students}+</div>
            <div className={styles.statLabel}>Active Students</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{animatedStats.ratings}+</div>
            <div className={styles.statLabel}>Meal Ratings</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{animatedStats.meals}+</div>
            <div className={styles.statLabel}>Menus Served</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>4.5⭐</div>
            <div className={styles.statLabel}>Avg Rating</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>Features</span>
          <h2 className={styles.sectionTitle}>Everything You Need</h2>
          <p className={styles.sectionSubtitle}>
            Simple tools to make your mess experience better
          </p>
        </div>
        <div className={styles.featureGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon} style={{ background: `${feature.color}15`, color: feature.color }}>
                <feature.icon />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className={styles.howItWorks}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>Simple Process</span>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <p className={styles.sectionSubtitle}>
            Get started in under a minute
          </p>
        </div>
        <div className={styles.stepsGrid}>
          {howItWorks.map((step, index) => (
            <div key={index} className={styles.stepCard}>
              <div className={styles.stepNumber}>{step.step}</div>
              <div className={styles.stepIcon}>
                <step.icon />
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              {index < howItWorks.length - 1 && (
                <div className={styles.stepArrow}>→</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonials}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>Reviews</span>
          <h2 className={styles.sectionTitle}>What Students Say</h2>
          <p className={styles.sectionSubtitle}>
            Real feedback from real users
          </p>
        </div>
        <div className={styles.testimonialGrid}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className={styles.testimonialCard}>
              <div className={styles.testimonialStars}>
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={i < testimonial.rating ? styles.starFilled : styles.starEmpty}
                  />
                ))}
              </div>
              <p className={styles.testimonialText}>"{testimonial.text}"</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className={styles.testimonialName}>{testimonial.name}</div>
                  <div className={styles.testimonialRole}>{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className={styles.faq}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>FAQ</span>
          <h2 className={styles.sectionTitle}>Common Questions</h2>
          <p className={styles.sectionSubtitle}>
            Quick answers to help you get started
          </p>
        </div>
        <div className={styles.faqGrid}>
          {faqs.map((faq, index) => (
            <div key={index} className={styles.faqCard}>
              <div className={styles.faqQuestion}>
                <FiMessageSquare />
                {faq.question}
              </div>
              <p className={styles.faqAnswer}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className={styles.finalCta}>
        <div className={styles.ctaContent}>
          <h2>Ready to Know What's for Lunch?</h2>
          <p>Join 500+ students who never walk to mess blindly anymore. Create your free account now!</p>
          <div className={styles.ctaButtons}>
            <Link to="/register">
              <Button size="large" icon={FiArrowRight} iconPosition="right">
                Create Free Account
              </Button>
            </Link>
          </div>
          <div className={styles.ctaFeatures}>
            <span><FiCheckCircle /> 100% Free</span>
            <span><FiCheckCircle /> No Credit Card</span>
            <span><FiCheckCircle /> 30 Second Signup</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>🍽️</span>
              <span className={styles.logoText}>SmartMess</span>
            </div>
            <p>Making hostel dining smarter, one meal at a time.</p>
          </div>
          <div className={styles.footerLinks}>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#faq">FAQ</a>
            <Link to="/login">Login</Link>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2026 SmartMess. Made with ❤️ for better campus dining.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
