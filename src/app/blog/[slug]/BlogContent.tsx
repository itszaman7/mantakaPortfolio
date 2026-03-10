'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Footer from '@/components/Footer';

type BlockType = 'heading' | 'paragraph' | 'image' | 'code' | 'quote' | 'link';
interface Block {
    id: string;
    type: BlockType;
    value: string;
    language?: string;
    url?: string;
}
interface Blog {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    content?: Block[];
    cover_image: string;
    published?: boolean;
    created_at: string;
    author?: string;
    tags?: string[];
}

export default function BlogContent({ blog, related }: { blog: Blog, related: Blog[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const blocks = gsap.utils.toArray('.blog-block');
        blocks.forEach((block: any) => {
            gsap.fromTo(block,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: block,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    }
                }
            );
        });

        gsap.to('.hero-bg', {
            scale: 1.15,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
            }
        });
    }, { scope: containerRef });

    return (
        <article ref={containerRef} className="min-h-screen relative text-black overflow-x-hidden selection:bg-red-600/30">
            {/* Fixed Background Layer (Non-clickable) */}
            <div className="fixed top-0 left-0 w-full h-screen overflow-hidden -z-10 bg-black pointer-events-none">
                {blog.cover_image && (
                    <img
                        src={blog.cover_image}
                        alt={blog.title}
                        className="hero-bg absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />
            </div>

            {/* Fixed Hero Content Layer (Clickable) */}
            <div className="fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center p-6 text-center z-0 pointer-events-none">
                <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 w-full max-w-4xl pointer-events-auto">
                    <nav className="relative z-50 flex justify-center items-center gap-4 text-[11px] md:text-xs font-mono tracking-widest uppercase mb-12 text-white/60">
                        <Link href="/" className="hover:text-white hover:underline underline-offset-4 transition-all relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-red-500 hover:after:w-full after:transition-all after:duration-300">HOME</Link>
                        <span className="text-red-600/80 font-bold">/</span>
                        <Link href="/blog" className="hover:text-white hover:underline underline-offset-4 transition-all relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-red-500 hover:after:w-full after:transition-all after:duration-300">BLOG</Link>
                        <span className="text-red-600/80 font-bold">/</span>
                        <span className="text-white font-serif tracking-normal capitalize text-sm md:text-base italic truncate max-w-[200px] md:max-w-xs">{blog.title}</span>
                    </nav>
                    <div className="flex items-center justify-center gap-4 text-xs md:text-sm font-bold tracking-[0.3em] uppercase text-red-500 mb-8">
                        <span>{new Date(blog.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                        <span>{blog.author || 'Mantaka'}</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl lg:text-[7rem] font-serif text-white font-bold leading-[0.9] max-w-6xl mx-auto tracking-tight">{blog.title}</h1>
                </div>

                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white flex flex-col items-center gap-4 animate-bounce">
                    <span className="text-[10px] uppercase tracking-widest font-bold">Scroll to read</span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-red-600 to-transparent" />
                </div>
            </div>

            <div ref={contentRef} className="relative z-10 bg-white mt-[100vh] pt-24 pb-32 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
                <div className="max-w-3xl mx-auto px-6 font-sans text-lg md:text-xl leading-relaxed text-gray-800">
                    <div className="space-y-8 md:space-y-12">
                        {blog.content?.map((block) => {
                            switch (block.type) {
                                case 'paragraph': return <p key={block.id} className="blog-block text-[1.1rem] md:text-[1.25rem] text-gray-700">{block.value}</p>;
                                case 'heading': return <h2 key={block.id} className="blog-block text-3xl md:text-4xl font-serif font-bold text-black mt-16 mb-8">{block.value}</h2>;
                                case 'quote': return (
                                    <blockquote key={block.id} className="blog-block text-2xl md:text-3xl font-serif italic text-black border-l-4 border-red-600 pl-6 md:pl-10 py-4 my-16 bg-gray-50 rounded-r-2xl shadow-sm">
                                        "{block.value}"
                                    </blockquote>
                                );
                                case 'link': return (
                                    <div key={block.id} className="blog-block my-12">
                                        {block.url ? (
                                            <a
                                                href={block.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group flex flex-col items-center justify-center py-10 px-6 bg-red-600 hover:bg-red-700 text-white rounded-2xl transition-all duration-300 shadow-[0_10px_30px_rgba(220,38,38,0.2)] hover:shadow-[0_15px_40px_rgba(220,38,38,0.4)] hover:-translate-y-1"
                                            >
                                                <span className="text-xl md:text-2xl font-bold tracking-tight mb-2">{block.value}</span>
                                                <span className="text-[10px] md:text-xs font-mono tracking-widest uppercase opacity-80 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                                    Visit Link <span className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
                                                </span>
                                            </a>
                                        ) : (
                                            <div className="py-10 px-6 bg-gray-100 text-center rounded-2xl text-gray-500 border border-gray-200">
                                                <span className="text-lg font-bold">{block.value}</span>
                                            </div>
                                        )}
                                    </div>
                                );
                                case 'image': return (
                                    <figure key={block.id} className="blog-block my-16">
                                        <div className="rounded-2xl overflow-hidden shadow-2xl relative w-full aspect-video bg-gray-100">
                                            <img src={block.value} alt="Blog illustration" className="w-full h-full object-cover" />
                                        </div>
                                    </figure>
                                );
                                case 'code': return (
                                    <div key={block.id} className="blog-block my-12 shadow-2xl rounded-xl overflow-hidden text-sm relative group">
                                        <div className="bg-[#1e1e1e] flex items-center px-4 py-3 border-b border-white/10">
                                            <div className="flex gap-2">
                                                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                            </div>
                                            <span className="ml-4 text-[10px] text-gray-500 uppercase font-bold tracking-widest">{block.language}</span>
                                        </div>
                                        <SyntaxHighlighter language={block.language || 'javascript'} style={vscDarkPlus} customStyle={{ margin: 0, padding: '2rem', fontSize: '14px', lineHeight: '1.6' }} wrapLines={true}>
                                            {block.value}
                                        </SyntaxHighlighter>
                                    </div>
                                );
                                default: return null;
                            }
                        })}
                    </div>
                    <div className="flex justify-center mt-32 mb-16">
                        <div className="flex gap-3"><span className="w-2 h-2 rounded-full bg-red-600"></span><span className="w-2 h-2 rounded-full bg-black"></span><span className="w-2 h-2 rounded-full bg-red-600"></span></div>
                    </div>
                </div>
            </div>

            {related.length > 0 && (
                <div className="relative z-10 bg-[#050505] py-32 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-8">
                            <h3 className="text-4xl md:text-5xl font-serif text-white">Read Next</h3>
                            <Link href="/blog" className="text-red-500 hover:text-white transition-colors text-sm font-bold tracking-widest uppercase flex items-center gap-2">View All <span>→</span></Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {related.map(post => (
                                <Link href={`/blog/${post.slug}`} key={post.id} className="group block cursor-pointer">
                                    <div className="w-full aspect-[4/3] bg-[#111] rounded-2xl overflow-hidden mb-6 relative">
                                        {post.cover_image && <img src={post.cover_image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={post.title} />}
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
                                    </div>
                                    <h4 className="text-2xl font-serif text-white group-hover:text-red-500 transition-colors mb-2">{post.title}</h4>
                                    <p className="text-sm text-gray-500 tracking-widest uppercase font-bold">{new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            <div className="relative z-10 bg-black"><Footer /></div>
        </article>
    );
}
