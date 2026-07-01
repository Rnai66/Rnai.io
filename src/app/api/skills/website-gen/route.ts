import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/firebase/verifyToken";

interface WebsiteGenRequest {
  template: string;
  title?: string;
  description?: string;
  customizations?: Record<string, string>;
}

// Website templates with complete HTML generation
const WEBSITE_TEMPLATES: Record<string, (title: string, customizations: Record<string, string>) => string> = {
  "wg-1": generateDesignerPortfolio,
  "wg-2": generateRestaurantPage,
  "wg-3": generateSaaSLanding,
  "wg-4": generatePhotoBlog,
  "wg-5": generateProductStore,
};

function generateDesignerPortfolio(title: string, cust: Record<string, string>): string {
  const name = cust?.name || "Alex Designer";
  const role = cust?.role || "UX/UI Designer";
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; background: #0f0f1e; color: #fff; }
        header { background: rgba(15,15,30,0.8); backdrop-filter: blur(10px); padding: 1.5rem 0; position: sticky; top: 0; z-index: 100; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
        nav { display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 1.8rem; font-weight: 800; background: linear-gradient(135deg, #a78bfa 0%, #06b6d4 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        nav ul { list-style: none; display: flex; gap: 2rem; }
        nav a { color: #fff; text-decoration: none; transition: color 0.3s; }
        nav a:hover { color: #a78bfa; }
        .hero { padding: 8rem 0; text-align: center; background: linear-gradient(135deg, rgba(167,139,250,0.1) 0%, rgba(6,182,212,0.1) 100%); }
        .hero h1 { font-size: 3.5rem; margin-bottom: 1rem; background: linear-gradient(135deg, #a78bfa 0%, #06b6d4 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero p { font-size: 1.2rem; color: #ccc; margin-bottom: 2rem; }
        .btn { padding: 1rem 2rem; background: linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%); color: white; border: none; border-radius: 50px; cursor: pointer; font-size: 1rem; font-weight: 700; transition: all 0.3s; text-decoration: none; }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(167,139,250,0.4); }
        .section { padding: 6rem 0; }
        .section-title { font-size: 2.5rem; margin-bottom: 3rem; text-align: center; }
        .projects-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        .project-card { background: #1a1a2e; border-radius: 15px; overflow: hidden; transition: all 0.3s; }
        .project-card:hover { transform: translateY(-10px); box-shadow: 0 15px 40px rgba(0,0,0,0.3); }
        .project-image { width: 100%; height: 200px; background: linear-gradient(135deg, #a78bfa 0%, #06b6d4 100%); }
        .project-content { padding: 2rem; }
        .project-content h3 { font-size: 1.3rem; margin-bottom: 0.5rem; }
        .project-content p { color: #aaa; font-size: 0.95rem; }
        .skills-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        .skill-card { text-align: center; padding: 2rem; background: #1a1a2e; border-radius: 15px; transition: all 0.3s; }
        .skill-card:hover { background: rgba(167,139,250,0.1); }
        .skill-icon { font-size: 3rem; margin-bottom: 1rem; }
        footer { background: #000; padding: 2rem 0; text-align: center; color: #666; border-top: 1px solid #333; }
        @media (max-width: 768px) {
            .projects-grid, .skills-grid { grid-template-columns: 1fr; }
            .hero h1 { font-size: 2.2rem; }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <nav>
                <div class="logo">💜 ${name}</div>
                <ul>
                    <li><a href="#work">Work</a></li>
                    <li><a href="#skills">Skills</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <h1>${name}</h1>
            <p>${role}</p>
            <button class="btn">✨ Let's Work Together</button>
        </div>
    </section>

    <section class="section" id="work">
        <div class="container">
            <h2 class="section-title">Featured Work</h2>
            <div class="projects-grid">
                <div class="project-card">
                    <div class="project-image"></div>
                    <div class="project-content">
                        <h3>Project One</h3>
                        <p>Creative design with modern UX patterns</p>
                    </div>
                </div>
                <div class="project-card">
                    <div class="project-image"></div>
                    <div class="project-content">
                        <h3>Project Two</h3>
                        <p>Brand identity and visual design</p>
                    </div>
                </div>
                <div class="project-card">
                    <div class="project-image"></div>
                    <div class="project-content">
                        <h3>Project Three</h3>
                        <p>Mobile app interface design</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="section" id="skills">
        <div class="container">
            <h2 class="section-title">Core Skills</h2>
            <div class="skills-grid">
                <div class="skill-card">
                    <div class="skill-icon">🎨</div>
                    <h3>UI Design</h3>
                </div>
                <div class="skill-card">
                    <div class="skill-icon">🔍</div>
                    <h3>UX Research</h3>
                </div>
                <div class="skill-card">
                    <div class="skill-icon">💻</div>
                    <h3>Web Design</h3>
                </div>
            </div>
        </div>
    </section>

    <footer>
        <div class="container">
            <p>&copy; 2026 ${name}. All rights reserved. | Generated by Rnai AI ✨</p>
        </div>
    </footer>
</body>
</html>`;
}

function generateRestaurantPage(title: string, cust: Record<string, string>): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Georgia', serif; background: #faf8f3; color: #333; }
        header { background: #2c2416; color: #fff; padding: 1.5rem 0; position: sticky; top: 0; z-index: 100; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
        nav { display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 1.8rem; font-weight: 800; color: #d4a574; }
        nav ul { list-style: none; display: flex; gap: 2rem; }
        nav a { color: #fff; text-decoration: none; }
        .hero { background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200') center/cover; padding: 10rem 0; text-align: center; color: #fff; }
        .hero h1 { font-size: 3.5rem; margin-bottom: 1rem; }
        .hero p { font-size: 1.2rem; margin-bottom: 2rem; }
        .btn { padding: 1rem 2rem; background: #d4a574; color: #2c2416; border: none; border-radius: 5px; cursor: pointer; font-weight: 700; transition: all 0.3s; }
        .btn:hover { background: #e6b896; transform: scale(1.05); }
        .section { padding: 6rem 0; }
        .section-title { font-size: 2.5rem; margin-bottom: 3rem; text-align: center; color: #2c2416; }
        .menu-items { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; }
        .menu-item { padding: 2rem; border-bottom: 2px solid #d4a574; }
        .menu-item h3 { font-size: 1.3rem; margin-bottom: 0.5rem; }
        .menu-item p { color: #666; font-size: 0.95rem; margin-bottom: 0.5rem; }
        .price { color: #d4a574; font-weight: 700; }
        footer { background: #2c2416; color: #fff; padding: 2rem 0; text-align: center; }
        @media (max-width: 768px) {
            .menu-items { grid-template-columns: 1fr; }
            .hero h1 { font-size: 2.2rem; }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <nav>
                <div class="logo">🍽️ La Cucina</div>
                <ul>
                    <li><a href="#menu">Menu</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#reserve">Reserve</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <h1>Welcome to La Cucina</h1>
            <p>Authentic Italian Fine Dining</p>
            <button class="btn">🗓️ Reserve a Table</button>
        </div>
    </section>

    <section class="section" id="menu">
        <div class="container">
            <h2 class="section-title">Featured Menu</h2>
            <div class="menu-items">
                <div class="menu-item">
                    <h3>🍝 Spaghetti Carbonara</h3>
                    <p>Traditional Italian pasta with guanciale and pecorino</p>
                    <div class="price">$18</div>
                </div>
                <div class="menu-item">
                    <h3>🦞 Lobster Risotto</h3>
                    <p>Creamy arborio rice with fresh lobster</p>
                    <div class="price">$32</div>
                </div>
                <div class="menu-item">
                    <h3>🥩 Osso Buco</h3>
                    <p>Braised veal shank with saffron risotto</p>
                    <div class="price">$28</div>
                </div>
                <div class="menu-item">
                    <h3>🍰 Tiramisu</h3>
                    <p>Classic Italian dessert with mascarpone cream</p>
                    <div class="price">$8</div>
                </div>
            </div>
        </div>
    </section>

    <footer>
        <div class="container">
            <p>&copy; 2026 La Cucina Restaurant. Generated by Rnai AI ✨</p>
        </div>
    </footer>
</body>
</html>`;
}

function generateSaaSLanding(title: string, cust: Record<string, string>): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; background: #fff; color: #222; }
        header { background: #fff; border-bottom: 1px solid #eee; padding: 1.5rem 0; position: sticky; top: 0; z-index: 100; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
        nav { display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 1.8rem; font-weight: 800; color: #0066ff; }
        nav ul { list-style: none; display: flex; gap: 2rem; }
        nav a { color: #333; text-decoration: none; font-weight: 600; }
        .hero { padding: 8rem 0; text-align: center; background: linear-gradient(135deg, #f0f4ff 0%, #fff 100%); }
        .hero h1 { font-size: 3.5rem; margin-bottom: 1rem; color: #000; }
        .hero p { font-size: 1.2rem; color: #666; margin-bottom: 2rem; }
        .btn { padding: 1rem 2rem; background: #0066ff; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 700; transition: all 0.3s; }
        .btn:hover { background: #0052cc; transform: translateY(-2px); }
        .btn-secondary { background: #f0f0f0; color: #333; margin-left: 1rem; }
        .btn-secondary:hover { background: #e0e0e0; }
        .section { padding: 6rem 0; }
        .section-title { font-size: 2.5rem; margin-bottom: 3rem; text-align: center; }
        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        .feature-card { text-align: center; padding: 2rem; }
        .feature-icon { font-size: 3rem; margin-bottom: 1rem; }
        .feature-card h3 { font-size: 1.3rem; margin-bottom: 1rem; }
        .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        .price-card { border: 2px solid #eee; border-radius: 10px; padding: 2rem; text-align: center; }
        .price-card.featured { border-color: #0066ff; background: #f0f4ff; transform: scale(1.05); }
        .price-card h3 { font-size: 1.5rem; margin-bottom: 1rem; }
        .price { font-size: 2.5rem; font-weight: 800; color: #0066ff; margin-bottom: 1rem; }
        footer { background: #f9f9f9; border-top: 1px solid #eee; padding: 2rem 0; text-align: center; color: #666; }
        @media (max-width: 768px) {
            .features-grid, .pricing-grid { grid-template-columns: 1fr; }
            .price-card.featured { transform: scale(1); }
            .hero h1 { font-size: 2.2rem; }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <nav>
                <div class="logo">✨ WriteAI</div>
                <ul>
                    <li><a href="#features">Features</a></li>
                    <li><a href="#pricing">Pricing</a></li>
                    <li><a href="#faq">FAQ</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <h1>Write Better, Faster with AI</h1>
            <p>The most powerful AI writing tool for content creators and businesses</p>
            <button class="btn">🚀 Start Free Trial</button>
            <button class="btn btn-secondary">📚 See Demo</button>
        </div>
    </section>

    <section class="section" id="features">
        <div class="container">
            <h2 class="section-title">Powerful Features</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">✍️</div>
                    <h3>AI Writing</h3>
                    <p>Generate high-quality content in seconds</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🔍</div>
                    <h3>SEO Optimized</h3>
                    <p>Rank higher on search engines</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🎯</div>
                    <h3>Tone Control</h3>
                    <p>Match any voice and style</p>
                </div>
            </div>
        </div>
    </section>

    <section class="section" id="pricing">
        <div class="container">
            <h2 class="section-title">Simple Pricing</h2>
            <div class="pricing-grid">
                <div class="price-card">
                    <h3>Starter</h3>
                    <div class="price">$29</div>
                    <p>Perfect for individuals</p>
                </div>
                <div class="price-card featured">
                    <h3>⭐ Professional</h3>
                    <div class="price">$79</div>
                    <p>Best for teams</p>
                </div>
                <div class="price-card">
                    <h3>Enterprise</h3>
                    <div class="price">Custom</div>
                    <p>For large organizations</p>
                </div>
            </div>
        </div>
    </section>

    <footer>
        <div class="container">
            <p>&copy; 2026 WriteAI. Generated by Rnai AI ✨</p>
        </div>
    </footer>
</body>
</html>`;
}

function generatePhotoBlog(title: string, cust: Record<string, string>): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Georgia', serif; background: #fff; color: #333; }
        header { background: #fff; border-bottom: 1px solid #eee; padding: 2rem 0; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
        .logo { font-size: 2rem; font-weight: 300; color: #333; }
        .hero { padding: 6rem 0; text-align: center; background: linear-gradient(135deg, #f5f5f5 0%, #fff 100%); }
        .hero h1 { font-size: 3rem; font-weight: 300; margin-bottom: 1rem; letter-spacing: 3px; }
        .hero p { font-size: 1.2rem; color: #666; }
        .section { padding: 6rem 0; }
        .section-title { font-size: 2rem; margin-bottom: 3rem; text-align: center; font-weight: 300; }
        .masonry { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .gallery-item { overflow: hidden; border-radius: 8px; aspect-ratio: 1; }
        .gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
        .gallery-item:hover img { transform: scale(1.05); }
        .blog-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 3rem; }
        .blog-post { padding: 2rem 0; border-bottom: 1px solid #eee; }
        .blog-post h3 { font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 600; }
        .blog-post .meta { color: #999; font-size: 0.9rem; margin-bottom: 1rem; }
        .blog-post p { color: #666; line-height: 1.8; }
        footer { background: #f9f9f9; padding: 2rem 0; text-align: center; color: #999; border-top: 1px solid #eee; }
        @media (max-width: 768px) {
            .masonry { grid-template-columns: repeat(2, 1fr); }
            .blog-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <div class="logo">📸 Travel Stories</div>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <h1>TRAVEL PHOTOGRAPHY</h1>
            <p>Exploring the world one frame at a time</p>
        </div>
    </section>

    <section class="section" id="gallery">
        <div class="container">
            <h2 class="section-title">Gallery</h2>
            <div class="masonry">
                <div class="gallery-item"><img src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400&q=80" alt=""></div>
                <div class="gallery-item"><img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80" alt=""></div>
                <div class="gallery-item"><img src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80" alt=""></div>
                <div class="gallery-item"><img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80" alt=""></div>
                <div class="gallery-item"><img src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=80" alt=""></div>
                <div class="gallery-item"><img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80" alt=""></div>
            </div>
        </div>
    </section>

    <section class="section" id="blog">
        <div class="container">
            <h2 class="section-title">Latest Stories</h2>
            <div class="blog-grid">
                <article class="blog-post">
                    <h3>Discovering Japan's Hidden Temples</h3>
                    <div class="meta">March 15, 2026 • 5 min read</div>
                    <p>A journey through the peaceful temples of Kyoto, where ancient traditions meet modern life. These sacred spaces offer a glimpse into Japan's rich spiritual heritage...</p>
                </article>
                <article class="blog-post">
                    <h3>Iceland: Land of Ice and Fire</h3>
                    <div class="meta">March 10, 2026 • 7 min read</div>
                    <p>From cascading waterfalls to geothermal hot springs, Iceland's dramatic landscapes offer endless photography opportunities. A complete guide to the best locations...</p>
                </article>
            </div>
        </div>
    </section>

    <footer>
        <div class="container">
            <p>&copy; 2026 Travel Stories. Generated by Rnai AI ✨</p>
        </div>
    </footer>
</body>
</html>`;
}

function generateProductStore(title: string, cust: Record<string, string>): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; background: #fefaf0; color: #333; }
        header { background: #fff; border-bottom: 1px solid #f0e6db; padding: 1.5rem 0; position: sticky; top: 0; z-index: 100; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
        nav { display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 1.8rem; font-weight: 800; color: #8b6f47; }
        nav a { color: #333; text-decoration: none; margin-left: 2rem; }
        .product-hero { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; padding: 4rem 0; align-items: center; }
        .product-image { width: 100%; aspect-ratio: 1; background: linear-gradient(135deg, #d4a574 0%, #f0e6db 100%); border-radius: 10px; }
        .product-info h1 { font-size: 2rem; margin-bottom: 1rem; }
        .rating { color: #f59e0b; margin-bottom: 1rem; }
        .price { font-size: 2rem; font-weight: 800; color: #8b6f47; margin-bottom: 1rem; }
        .description { color: #666; line-height: 1.8; margin-bottom: 2rem; }
        .options { display: flex; gap: 1rem; margin-bottom: 2rem; }
        .option { padding: 0.8rem 1.5rem; border: 2px solid #e0d5c7; border-radius: 8px; cursor: pointer; }
        .option.active { border-color: #8b6f47; background: #f0e6db; }
        .btn { padding: 1.2rem 2.5rem; background: #8b6f47; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 1rem; }
        .btn:hover { background: #6f5838; }
        .reviews { padding: 3rem 0; border-top: 1px solid #f0e6db; }
        .review-item { margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid #f0e6db; }
        .review-item .name { font-weight: 700; margin-bottom: 0.5rem; }
        .review-item .rating { color: #f59e0b; margin-bottom: 0.5rem; }
        footer { background: #f9f9f9; padding: 2rem 0; text-align: center; color: #999; }
        @media (max-width: 768px) {
            .product-hero { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <nav>
                <div class="logo">🛍️ Artisan</div>
                <div>
                    <a href="#shop">Shop</a>
                    <a href="#about">About</a>
                    <a href="#contact">Contact</a>
                </div>
            </nav>
        </div>
    </header>

    <section class="product-hero">
        <div class="container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;">
            <div class="product-image"></div>
            <div class="product-info">
                <h1>Handmade Ceramic Jewelry</h1>
                <div class="rating">⭐⭐⭐⭐⭐ 4.8 (124 reviews)</div>
                <div class="price">$49.99</div>
                <p class="description">Beautifully crafted ceramic jewelry pieces, each one unique. Made with sustainable materials and traditional techniques. Perfect for any occasion.</p>

                <h3 style="margin-bottom: 1rem;">Color</h3>
                <div class="options">
                    <div class="option active">White</div>
                    <div class="option">Beige</div>
                    <div class="option">Blue</div>
                </div>

                <h3 style="margin-bottom: 1rem;">Size</h3>
                <div class="options">
                    <div class="option">S</div>
                    <div class="option active">M</div>
                    <div class="option">L</div>
                </div>

                <button class="btn">🛒 Add to Cart</button>
            </div>
        </div>
    </section>

    <section class="reviews">
        <div class="container">
            <h2>Customer Reviews</h2>
            <div class="review-item">
                <div class="name">Sarah M.</div>
                <div class="rating">⭐⭐⭐⭐⭐</div>
                <p>"Absolutely beautiful piece! The craftsmanship is incredible and it arrived perfectly packaged."</p>
            </div>
            <div class="review-item">
                <div class="name">John D.</div>
                <div class="rating">⭐⭐⭐⭐⭐</div>
                <p>"Bought this as a gift and she loved it. Unique, elegant, and high quality. Highly recommend!"</p>
            </div>
        </div>
    </section>

    <footer>
        <div class="container">
            <p>&copy; 2026 Artisan Jewelry. Generated by Rnai AI ✨</p>
        </div>
    </footer>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("__session")?.value;
    const uid = await verifyToken(req.headers.get("authorization"), sessionCookie);
    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json() as WebsiteGenRequest;
    const template = body.template || "wg-1";
    const title = body.title || "My Website";
    const customizations = body.customizations || {};

    const generator = WEBSITE_TEMPLATES[template];
    if (!generator) {
      return NextResponse.json({ error: "Template not found" }, { status: 400 });
    }

    const htmlContent = generator(title, customizations);

    return NextResponse.json({
      ok: true,
      html: htmlContent,
      template,
      title,
    });
  } catch (err) {
    console.error("API /skills/website-gen error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
