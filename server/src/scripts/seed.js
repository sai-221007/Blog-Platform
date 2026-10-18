require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Newsletter = require('../models/Newsletter');
const Bookmark = require('../models/Bookmark');
const slugify = require('../utils/slugify');
const calculateReadingTime = require('../utils/readingTime');

const seedData = async () => {
  console.log('[Seed] Starting INKORA database seeding...');

  // Clear existing collections
  await User.deleteMany({});
  await Post.deleteMany({});
  await Comment.deleteMany({});
  await Newsletter.deleteMany({});
  await Bookmark.deleteMany({});

  console.log('[Seed] Cleared existing data.');

  // Create Users with hashed passwords
  const defaultPasswordHash = await User.hashPassword('Password123!');
  const adminPasswordHash = await User.hashPassword('AdminPassword123!');

  const users = await User.create([
    {
      name: 'Julian Cross',
      email: 'demo@inkora.com',
      passwordHash: defaultPasswordHash,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      bio: 'Senior editor and creative technologist exploring modern interface philosophy.',
      role: 'author',
    },
    {
      name: 'Elena Vance',
      email: 'elena@inkora.com',
      passwordHash: defaultPasswordHash,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
      bio: 'Architect of visual systems, design director, and researcher in cognitive aesthetics.',
      role: 'author',
    },
    {
      name: 'Marcus Sterling',
      email: 'marcus@inkora.com',
      passwordHash: defaultPasswordHash,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      bio: 'Distributed systems engineer writing on software longevity, memory models, and Unix philosophy.',
      role: 'author',
    },
    {
      name: 'Aria Thorne',
      email: 'aria@inkora.com',
      passwordHash: defaultPasswordHash,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      bio: 'Theoretical physicist and essayist probing computing, optical materials, and thermodynamics.',
      role: 'author',
    },
    {
      name: 'Editorial Admin',
      email: 'admin@inkora.com',
      passwordHash: adminPasswordHash,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      bio: 'Curator & Editor-in-Chief at INKORA Editorial Collective.',
      role: 'admin',
    },
  ]);

  const [julian, elena, marcus, aria, admin] = users;

  console.log(`[Seed] Created ${users.length} authors and administrative users.`);

  // Sample Articles
  const articlesData = [
    {
      author: elena._id,
      title: 'The Geometry of Thought: Why Form Still Follows Architecture in Modern Systems',
      summary: 'In an era of fleeting micro-trends, intentional design returns to geometric rigor, tactile typography, and spatial clarity. We explore how physical architecture shapes digital longevity.',
      coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      category: 'Design',
      tags: ['Architecture', 'Visual Design', 'Typography', 'Minimalism'],
      status: 'published',
      views: 3420,
      likesCount: 142,
      content: `## The Return of Structural Intention

Modern design has spent a decade chasing homogenization. Rounded corners, safe pastel palettes, and interchangeable design systems have drained the web of visceral distinction. Yet, when we inspect the artifacts of architectural history—from the Bauhaus workshops of Dessau to the brutalist monoliths of mid-century London—we discover a truth that digital designers frequently ignore: **form does not merely follow function; form dignifies purpose**.

### 1. Spatial Rhythm and the Editorial Grid

An editorial surface is not merely a container for text; it is an orchestrated sequence of pauses, weights, and tensions. Consider how a physical broadsheet commands attention:

> "Typography is the craft of endowing human language with a durable visual form. When an idea leaves a mark, it is the geometry of that mark which decides whether it echoes or evaporates."

When designing INKORA's layout, our mandate was to reject the cookie-cutter card layout. Instead, we turned to asymmetrical balance, monumental headlines, and generous gutters. Whitespace is not empty void; it is the silence between musical notes that makes melody intelligible.

### 2. The Tactility of High-Resolution Screens

With display densities surpassing 450 PPI, pixels are no longer discernible bricks; they are continuous ink. Our digital instruments must acknowledge this material evolution:

- **Subtle Optical Kerns**: Prioritizing serif typography designed for prolonged contemplation.
- **Deep Spectral Neutrals**: Midnight tones that simulate fine Japanese Sumi ink rather than clinical monitor black.
- **Restrained Motion**: Micro-interactions that honor inertia, never distracting from the written word.

When interface elements behave with the quiet dignity of precision physical instruments, the act of reading transforms from passive consumption to active communion.`,
    },
    {
      author: marcus._id,
      title: 'The Architecture of Silent Software: Crafting Systems that Endure Without Friction',
      summary: 'Software that demands attention is often software in distress. True engineering elegance lies in quiet predictability, robust state machines, and zero superfluous complexity.',
      coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
      category: 'Programming',
      tags: ['Architecture', 'Distributed Systems', 'Software Engineering', 'Philosophy'],
      status: 'published',
      views: 4890,
      likesCount: 289,
      content: `## The Myth of Perpetual Noise

Every modern notification badge, intrusive modal, and jittery UI update represents a small failure of trust between the machine and the human mind. The most resilient software on Earth—from the flight controls of commercial airliners to the core Unix daemons written four decades ago—shares a single virtue: **profound quietude**.

### Principles of Silent Software

Why do modern web stacks consume hundreds of megabytes just to display a page of prose? The answer lies in architectural indecision. When engineers lack confidence in boundaries, they compensate with layers.

\`\`\`javascript
// The ideal API: Deterministic, minimal, and self-documenting
class ResilientPipeline {
  constructor(kernel) {
    this.kernel = Object.freeze(kernel);
    this.state = 'IDLE';
  }

  async dispatch(event) {
    if (!this.isValid(event)) throw new Error('Invariant violated');
    return this.kernel.execute(event);
  }
}
\`\`\`

### Invariants Over Interventions

When we structure backend logic with immutable contracts, database indexes matched to query profiles, and strict domain boundaries, errors cease to be mysteries. They become mathematically improbable.

1. **Deterministic Latency**: Every API endpoint must respond within a predictable percentile band.
2. **Explicit Data Flow**: No hidden background side-effects that mutate external state unexpectedly.
3. **Graceful Degeneration**: When network conditions deteriorate, the application sheds ornamental features while keeping the core reading and publishing pipeline fully functional.`,
    },
    {
      author: aria._id,
      title: 'Beyond the Silicon Horizon: Optical Computing, Thermodynamics, and the Post-CMOS Era',
      summary: 'As transistor gate widths approach fundamental quantum limits, photonics and thermodynamic computing offer a radically different physics for processing information.',
      coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
      category: 'Science',
      tags: ['Quantum', 'Physics', 'Computing', 'Photonics'],
      status: 'published',
      views: 2950,
      likesCount: 178,
      content: `## When Electrons Meet Their Physical Limits

For over sixty years, Moore's Law functioned not as an empirical observation, but as an industry manifesto. We squeezed billions of silicon transistors into the surface area of a postage stamp. Yet at three nanometers, quantum tunneling ceases to be a theoretical anomaly—it becomes a catastrophic current leak.

### The Photonic Alternative

Photons have zero rest mass and do not experience electromagnetic interference in the same manner as charges traversing a copper trace:

> "Light carries information at the ultimate physical speed limit of the universe, with near-zero heat dissipation per bit operation."

Recent breakthroughs in integrated lithium niobate photonic circuits demonstrate that matrix multiplication—the mathematical engine behind physics simulations and graph traversals—can occur at the speed of light through constructive and destructive wave interference.

### What This Means for Future Engineering

- **Energy-Free Tensor Operations**: Computations performed passively as wavefronts traverse waveguides.
- **Extreme Bandwidth Densities**: Terabit-per-second interconnects without thermal throttling.
- **Thermodynamic Alignment**: Computing architectures that respect Landauer's principle rather than fighting against heat entropy.`,
    },
    {
      author: julian._id,
      title: 'Craft Over Velocity: The Modern Renaissance of Intentional Typography',
      summary: 'In a digital ecosystem flooded with generic typefaces, bespoke letterforms and typographic rhythm are re-emerging as the primary signifier of intellectual substance.',
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
      category: 'Creativity',
      tags: ['Typography', 'Editorial', 'Letterforms', 'Craft'],
      status: 'published',
      views: 1980,
      likesCount: 115,
      content: `## The Sacred Geometry of the Printed Page

Before screens, type was a molten alloy of lead, antimony, and tin. A typesetter held the weight of language in their palms. Every ligature was a physical decision; every point size was cut individually by a punchcutter looking through a magnifying loupe.

### Why Serif Typography Resonates Today

Serifs are not historical ornaments; they are directional guides that pull the eye across horizontal planes. In editorial design, a well-drawn serif creates a sense of gravitas that no geometric sans-serif can duplicate.

On INKORA, we combine modern high-contrast editorial serifs for article headings with surgical sans-serifs for interface chrome. The contrast creates an immediate cognitive shift:
- **The Chrome (Sans)**: Clear, utilitarian, objective.
- **The Body (Serif)**: Contemplative, voiceful, literary.

When you write on INKORA, your words are cast in a typographic environment that treats thought with reverence.`,
    },
    {
      author: elena._id,
      title: 'Synthetic Perception: What Spatial WebGL Teaches Us About Human Cognition',
      summary: 'Real-time 3D environments on the web are not mere decorative flourishes. They represent an evolution from flat 2D planes into dynamic spatial memory palaces.',
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      category: 'Technology',
      tags: ['3D Web', 'WebGL', 'ThreeJS', 'Human Computer Interaction'],
      status: 'published',
      views: 3120,
      likesCount: 204,
      content: `## Beyond the Flatland of Browsers

For thirty years, the web was essentially a digitized document reader. HTML stood for HyperText Markup Language, and browsers rendered vertical scrolls of paragraphs and boxes.

### Spatial Depth as Cognitive Scaffolding

When we introduce real-time 3D geometry into an editorial experience:
- Atmospheric particles give the viewer a sense of tangible physical space.
- Floating translucent forms evoke the permanence of sculptural artifacts.
- Gentle parallax responds to human intent without seizing control of attention.

The goal is not to turn an article into a video game. The goal is to provide a cinematic backdrop that feels alive, breathing quietly in the periphery while the reader immerses themselves in the central thesis.`,
    },
    {
      author: marcus._id,
      title: 'Algorithmic Solitude: Reclaiming Deep Focus in an Era of Accelerated Distraction',
      summary: 'Constant digital stimulation fragments working memory. How independent creators and thinkers can design personal architectures for uninterrupted contemplation.',
      coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
      category: 'Lifestyle',
      tags: ['Deep Work', 'Focus', 'Mindfulness', 'Productivity'],
      status: 'published',
      views: 2640,
      likesCount: 167,
      content: `## The Fragmentation of the Creative Consciousness

We have constructed an information environment that treats silence as an error code. Every pause is immediately filled with infinite feeds, automated notifications, and urgent trivialities.

### Designing an Intentional Sanctuary

1. **Mono-tasking by Design**: Closing background tabs and silencing all non-essential interrupts.
2. **Long-form Engagement**: Choosing 2,000-word essays over 280-character soundbites.
3. **Physical Friction**: Keeping phones in separate rooms during writing hours.

Writing is thought crystallized into symbols. When the mind is calm, ideas leave a deeper mark.`,
    },
    {
      author: aria._id,
      title: 'The Anatomy of Resilient Micro-Enterprises in the Post-Platform Economy',
      summary: 'Bypassing algorithmic gatekeepers: how niche publications, boutique software studios, and independent authors build sustainable, direct-to-audience longevity.',
      coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      category: 'Business',
      tags: ['Business', 'Independent Publishing', 'Economics', 'Creator Economy'],
      status: 'published',
      views: 2210,
      likesCount: 139,
      content: `## Escaping the Algorithmic Treadmill

For the past decade, creators were promised that social platforms were their allies. Yet every year, organic reach was throttled, ad revenues shrank, and creator ownership was diluted.

### Direct Relationships Over Platform Dependence

The most successful contemporary publishing models are returning to fundamental economic principles:
- **Direct Subscriber Connection**: Newsletters, RSS, and authenticated memberships.
- **Editorial Exclusivity**: Quality and depth that cannot be replicated by automated content factories.
- **Community Governance**: Readers who engage meaningfully in comments and discourse.

When you control your publishing platform, you control your cultural destiny.`,
    },
    {
      author: julian._id,
      title: 'Draft: The Philosophy of Ink: From Sumerian Cuneiform to Modern Typography',
      summary: 'An exploration of how marking physical surfaces shaped the trajectory of human civilization, and what digital mediums owe to the legacy of physical ink.',
      coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
      category: 'Creativity',
      tags: ['Draft', 'History', 'Ink', 'Writing'],
      status: 'draft',
      views: 0,
      likesCount: 0,
      content: `This is a working draft exploring the history of physical ink and its cognitive connection to modern digital reading surfaces. In development.`,
    },
  ];

  // Insert Posts
  const createdPosts = [];
  for (const item of articlesData) {
    const slug = slugify(item.title) + '-' + Math.random().toString(36).substring(2, 6);
    const readingTime = calculateReadingTime(item.content);
    const post = await Post.create({
      ...item,
      slug,
      readingTime,
      publishedAt: item.status === 'draft' ? null : new Date(Date.now() - Math.floor(Math.random() * 10 * 86400000)),
    });
    createdPosts.push(post);
  }

  console.log(`[Seed] Created ${createdPosts.length} editorial articles.`);

  // Create Comments
  const firstPost = createdPosts[0];
  const secondPost = createdPosts[1];
  const thirdPost = createdPosts[2];

  await Comment.create([
    {
      post: firstPost._id,
      author: marcus._id,
      content: 'Elena, this critique of interchangeable design systems is spot on. The loss of editorial courage in modern digital products is tragic. The Bauhaus reference felt particularly resonant.',
    },
    {
      post: firstPost._id,
      author: julian._id,
      content: 'Remarkable essay. The concept that form does not merely follow function, but dignifies purpose, captures the exact ethos of what we are building with INKORA.',
    },
    {
      post: secondPost._id,
      author: aria._id,
      content: 'The section on deterministic latency and invariant contracts mirrors physical principles of thermodynamic equilibrium. Software should indeed be quiet.',
    },
    {
      post: secondPost._id,
      author: elena._id,
      content: 'As someone who primarily works in visual space, seeing engineers advocate for quiet software gives me immense hope. The visual UI is always a reflection of the underlying pipeline.',
    },
    {
      post: thirdPost._id,
      author: marcus._id,
      content: 'The lithium niobate photonic waveguide research is mind-bending. Have you looked into the thermal noise floor at cryogenic versus ambient operating temperatures?',
    },
  ]);

  console.log(`[Seed] Created sample comments.`);

  // Create Sample Newsletter Subscribers
  await Newsletter.create([
    { email: 'reader1@editorial.org' },
    { email: 'curator@designreview.com' },
    { email: 'architect@studioflint.co' },
  ]);

  // Set up Bookmarks
  await Bookmark.create({
    user: julian._id,
    post: firstPost._id,
  });
  await Bookmark.create({
    user: julian._id,
    post: secondPost._id,
  });

  await User.findByIdAndUpdate(julian._id, {
    $set: { bookmarks: [firstPost._id, secondPost._id] },
  });

  console.log('[Seed] Database seeding completed successfully! ✨');
};

// Allow running directly or via require
if (require.main === module) {
  connectDB()
    .then(async () => {
      await seedData();
      await disconnectDB();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('[Seed] Error during seeding:', err);
      await disconnectDB();
      process.exit(1);
    });
}

module.exports = seedData;
