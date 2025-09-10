# 🚀 Quick Update Guide

## Most Common Updates

### 📸 **Change Banner Image**
1. Replace `data/banner.jpg` with your new image
2. Keep same filename OR update CSS in `styles.css` line 113

### ✏️ **Update Name & Title**
**Option 1: Direct HTML** (index.html line 39-40):
```html
<h1>Your Name Here</h1>
<p class="hero-subtitle">Your Sport/Title</p>
```

**Option 2: JSON** (data/content.json):
```json
"profile": {
  "name": "Your Name Here",
  "title": "Your Sport/Title"
}
```

### 📰 **Add News Article**
1. Add image to `data/images/news/your-image.jpg`
2. In `index.html`, find the news section and add:
```html
<article class="news-card">
    <img src="data/images/news/your-image.jpg" alt="News Story">
    <div class="news-content">
        <div class="news-meta">
            <span class="news-date">March 20, 2024</span>
            <span class="news-source">News Source</span>
        </div>
        <h3>Your News Title</h3>
        <p>Your news excerpt...</p>
        <a href="https://your-real-news-link.com" target="_blank" class="news-link">
            Read More <i class="fas fa-arrow-right"></i>
        </a>
    </div>
</article>
```

### 📱 **Update Social Media Links**
In `index.html` footer section (around line 286):
```html
<div class="social-links">
    <a href="https://instagram.com/yourusername" target="_blank"><i class="fab fa-instagram"></i></a>
    <a href="https://twitter.com/yourusername" target="_blank"><i class="fab fa-twitter"></i></a>
    <a href="https://facebook.com/yourusername" target="_blank"><i class="fab fa-facebook"></i></a>
    <a href="https://youtube.com/yourusername" target="_blank"><i class="fab fa-youtube"></i></a>
</div>
```

### 📊 **Update Statistics**
In `index.html` hero section (around line 45-60):
```html
<div class="stat-card">
    <h3>342</h3>
    <p>Perfect 10s</p>
</div>
```

### 🏆 **Add Achievement**
In `index.html` highlights section, add:
```html
<div class="achievement-card">
    <i class="fas fa-trophy"></i>
    <h3>Your Achievement</h3>
    <p>Description of your achievement</p>
</div>
```

## 📂 File Locations Quick Reference

| Content Type | HTML Location | JSON Location | Image Folder |
|-------------|---------------|---------------|-------------|
| Profile Info | Line 39-42 | profile | data/images/profile/ |
| Statistics | Line 45-60 | statistics | N/A |
| Timeline | Line 71-121 | timeline | data/images/timeline/ |
| Achievements | Line 130-160 | achievements | N/A |
| Media Gallery | Line 169-217 | media | data/images/media/ |
| News Articles | Line 226-274 | news | data/images/news/ |
| Social Links | Line 286-290 | socialMedia | N/A |

## 🔗 Making Links Work

### News Links
- Replace `href="#"` with actual URLs like `href="https://espn.com/your-article"`
- Always add `target="_blank"` to open in new tab
- Test links work before going live

### Social Media Links
- Use your actual social media URLs
- Keep the `target="_blank"` attribute
- Remove unused social platforms

## 💡 Pro Tips

1. **Image Sizes**: 
   - Banner: 1920x1080px
   - Timeline: 300x200px
   - Media: 400x300px
   - News: 350x200px

2. **Testing**: Always test in browser after changes

3. **Backup**: Save a copy of your `data/` folder before major changes

4. **Performance**: Compress large images before adding

## 🚨 Common Issues

**Images not showing?**
- Check file path spelling
- Ensure image is in correct folder
- Try refreshing browser cache (Ctrl+F5)

**Links not working?**
- Verify URL is complete (includes https://)
- Check for typos in href attribute
- Ensure target="_blank" for external links

**Layout broken?**
- Check for missing closing tags in HTML
- Validate file paths are correct
- Inspect browser console for errors (F12)
