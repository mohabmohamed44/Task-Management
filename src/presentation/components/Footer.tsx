import { Link, useLocation } from "react-router";
import { Heart } from "lucide-react";
import { FaXTwitter, FaLinkedin, FaFacebook, FaGithub } from "react-icons/fa6";

export default function Footer() {
	const location = useLocation();
	const currentYear = new Date().getFullYear();

	const platformLinks = [
		{ path: "/statistics", label: "Dashboard" },
		{ path: "/tasks", label: "Tasks" },
		{ path: "/kanban", label: "Kanban" },
		{ path: "/goals", label: "Goals" },
	];

	const accountLinks = [
		{ path: "/profile", label: "Profile" },
		{ path: "/settings", label: "Settings" },
		{ path: "/privacy", label: "Privacy Policy" },
		{ path: "/terms", label: "Terms of Service" },
	];

	const socialLinks = [
		{
			icon: <FaGithub className="size-4" />,
			link: "https://github.com/mohabmohamed44",
			label: "GitHub",
			hoverColor: "hover:bg-zinc-800 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-black"
		},
		{
			icon: <FaFacebook className="size-4" />,
			link: "https://facebook.com",
			label: "Facebook",
			hoverColor: "hover:bg-[#1877F2] hover:text-white"
		},
		{
			icon: <FaLinkedin className="size-4" />,
			link: "https://linkedin.com",
			label: "LinkedIn",
			hoverColor: "hover:bg-[#0077B5] hover:text-white"
		},
		{
			icon: <FaXTwitter className="size-4" />,
			link: "https://twitter.com",
			label: "Twitter",
			hoverColor: "hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
		},
	];

	return (
		<footer className="relative bg-background">
			{/* Radial background glow and top border line */}
			<div className="bg-[radial-gradient(35%_80%_at_50%_0%,rgba(120,119,198,0.1),transparent)] mx-auto max-w-5xl md:border-x border-border/60">
				<div className="bg-border/60 absolute inset-x-0 h-px w-full" />
				
				<div className="grid max-w-5xl grid-cols-6 gap-8 px-6 py-12">
					{/* Brand Column */}
					<div className="col-span-6 flex flex-col gap-4 md:col-span-3">
						<Link to="/" className="inline-flex items-center gap-2 group w-max">
							<div className="flex h-14 w-14 items-center justify-center rounded-lg border border-border bg-muted/50 transition-all duration-300 group-hover:scale-105">
								{/* <LayoutGrid className="h-4 w-4 text-foreground transition-transform duration-300 group-hover:rotate-12" /> */}
                <img
                  src="/src/assets/logo.png"
                  alt="Prioritize logo"
                  className="h-12 w-12 object-contain"
                />
							</div>
							<span className="font-semibold tracking-tight text-foreground text-lg">
								Prioritize
							</span>
						</Link>
						<p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
							Organize, prioritize, and conquer your tasks with our intuitive platform designed for individuals and teams.
						</p>
						<div className="flex gap-2 mt-2">
							{socialLinks.map((item, i) => (
								<a
									key={i}
									className={`text-muted-foreground border border-border rounded-lg p-2 transition-all duration-300 ${item.hoverColor}`}
									target="_blank"
									rel="noopener noreferrer"
									href={item.link}
									aria-label={item.label}
								>
									{item.icon}
								</a>
							))}
						</div>
					</div>

					{/* Platform Links */}
					<div className="col-span-3 md:col-span-1">
						<span className="text-muted-foreground/80 block mb-3 text-xs font-semibold uppercase tracking-wider">
							Platform
						</span>
						<div className="flex flex-col gap-2">
							{platformLinks.map((link) => (
								<Link
									key={link.path}
									to={link.path}
									className={`w-max text-sm transition-colors duration-200 hover:text-foreground ${
										location.pathname === link.path
											? "text-foreground font-medium"
											: "text-muted-foreground"
									}`}
								>
									{link.label}
								</Link>
							))}
						</div>
					</div>

					{/* Account Links */}
					<div className="col-span-3 md:col-span-1">
						<span className="text-muted-foreground/80 block mb-3 text-xs font-semibold uppercase tracking-wider">
							Account
						</span>
						<div className="flex flex-col gap-2">
							{accountLinks.map((link) => (
								<Link
									key={link.path}
									to={link.path}
									className={`w-max text-sm transition-colors duration-200 hover:text-foreground ${
										location.pathname === link.path
											? "text-foreground font-medium"
											: "text-muted-foreground"
									}`}
								>
									{link.label}
								</Link>
							))}
						</div>
					</div>
				</div>

				{/* Bottom Border and Copyright bar */}
				<div className="bg-border/60 absolute inset-x-0 h-px w-full" />
				<div className="flex flex-col sm:flex-row justify-between items-center gap-4 max-w-5xl px-6 py-6 md:border-x border-border/0">
					<p className="text-muted-foreground text-xs font-light">
						&copy; {currentYear} Prioritize. All rights reserved.
					</p>
					<p className="text-muted-foreground text-xs flex items-center gap-1 font-light">
						Made with <Heart className="h-3 w-3 text-rose-500 fill-current" /> by Prioritize
					</p>
				</div>
			</div>
		</footer>
	);
}