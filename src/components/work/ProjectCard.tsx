import Image from "next/image";
import { Project } from "./projectsData";

interface ProjectCardProps {
    project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
    return (
        <div className="relative w-full h-full group bg-black/5 overflow-hidden rounded-md border border-white/5 transition-all duration-700">
            {/* Media Background */}
            <Image
                src={project.src}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105 opacity-80 group-hover:opacity-100"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Content Wrapper */}
            <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-between z-10">

                {/* Top Header: Badge & Icons */}
                <div className="flex justify-between items-start w-full">
                    {/* Award Badge (Top-Left) */}
                    {project.award ? (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 shadow-lg animate-float">
                            <span className="text-sm">{project.award.icon}</span>
                            <span className="text-[10px] font-bold text-white tracking-wide uppercase">{project.award.name}</span>
                        </div>
                    ) : <div />}

                    {/* Tech Stack Icons (Top-Right) */}
                    <div className="flex -space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        {project.techStack.map((tech, i) => (
                            <div
                                key={i}
                                className="w-8 h-8 rounded-full bg-zinc-900 border border-white/20 flex items-center justify-center text-[10px] text-gray-300 shadow-md transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300"
                                style={{ transitionDelay: `${i * 50}ms` }}
                            >
                                {tech.slice(0, 2)}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Text Content */}
                <div className="space-y-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <div>
                        <p className="text-xs font-bold tracking-[0.2em] text-red-500 uppercase mb-2">
                            {project.category}
                        </p>
                        <h3 className="font-space-grotesk font-bold text-3xl md:text-5xl text-white tracking-tighter leading-none group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all duration-300">
                            {project.title}
                        </h3>
                    </div>

                    <p className="text-sm md:text-base text-gray-300 max-w-[90%] leading-relaxed opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-75">
                        {project.description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
