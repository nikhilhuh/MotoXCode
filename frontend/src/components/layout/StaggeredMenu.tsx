import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./StaggeredMenu.css";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useFeedback } from "@/context/FeedbackContext";
import { cmsService } from "@/services";
import Cliploader from "@/components/ui/Cliploader";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { FaPencil, FaTrash, FaPlus } from "react-icons/fa6";
import axios from "axios";

const SOCIAL_OPTIONS = [
  "Instagram",
  "YouTube",
  "WhatsApp",
  "Strava",
  "Facebook",
  "Twitter",
  "Discord",
  "LinkedIn",
  "Other",
];

export interface StaggeredMenuItem {
  label: string;
  to: string;
}
export interface StaggeredMenuSocialItem {
  _id: string;
  label: string;
  link: string;
}
export interface StaggeredMenuProps {
  position?: "left" | "right";
  colors?: string[];
  items?: StaggeredMenuItem[];
  socialItems?: StaggeredMenuSocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  accentColor?: string;
  changeMenuColorOnOpen?: boolean;
  closeOnClickAway?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  onUpdateSocials?: (newSocials: StaggeredMenuSocialItem[]) => void;
}

const EMPTY_ITEMS: StaggeredMenuItem[] = [];
const EMPTY_SOCIALS: StaggeredMenuSocialItem[] = [];

export const StaggeredMenu: React.FC<StaggeredMenuProps> = ({
  position = "right",
  colors = ["var(--color-bg)", "var(--color-surface)"],
  items = EMPTY_ITEMS,
  socialItems = EMPTY_SOCIALS,
  displaySocials = true,
  displayItemNumbering = true,
  menuButtonColor = "var(--color-text)",
  openMenuButtonColor = "var(--color-text)",
  changeMenuColorOnOpen = true,
  accentColor = "var(--color-primary)",
  closeOnClickAway = true,
  onMenuOpen,
  onMenuClose,
  onUpdateSocials,
}: StaggeredMenuProps) => {
  const { userDetails, isInitialized } = useUser();
  const isAdmin = userDetails?.role === "admin";
  const { showSuccess, showError } = useFeedback();

  const [open, setOpen] = useState<boolean>(false);
  const openRef = useRef<boolean>(false);
  const location = useLocation();

  const [isEditingSocials, setIsEditingSocials] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [editSocials, setEditSocials] = useState<StaggeredMenuSocialItem[]>([]);

  const startEditingSocials = () => {
    setEditSocials([...socialItems]);
    setIsEditingSocials(true);
  };

  const handleSocialChange = (
    index: number,
    field: keyof StaggeredMenuSocialItem,
    value: string,
  ) => {
    const newSocials = [...editSocials];
    newSocials[index] = { ...newSocials[index], [field]: value };
    setEditSocials(newSocials);
  };

  const addSocial = () => {
    setEditSocials([...editSocials, { _id: "", label: "Globe", link: "" }]);
  };

  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const confirmDeleteDraft = (index: number) => {
    setDeleteIndex(index);
  };

  const executeDeleteDraft = () => {
    if (deleteIndex !== null) {
      const newSocials = [...editSocials];
      newSocials.splice(deleteIndex, 1);
      setEditSocials(newSocials);
      setDeleteIndex(null);
    }
  };

  const handleSaveSocials = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      const payload = editSocials.map((s) => ({
        id: s._id || "",
        label: s.label,
        link: s.link,
      }));
      formData.append("socials", JSON.stringify(payload));

      const res = await cmsService.updateHomeCMSData("socials", formData);
      if (res.success) {
        showSuccess("Socials updated!");
        setIsEditingSocials(false);
        // Note: We cast to any here because onUpdateSocials might expect Social[] but StaggeredMenuSocialItem is compatible
        if (onUpdateSocials) onUpdateSocials(res.data as any);
      } else {
        showError(res.message || "Failed to update socials");
      }
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        showError(err.response.data.message || "Error updating socials");
      } else if (err instanceof Error) {
        showError(err.message);
      } else {
        showError("An unexpected error occurred.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const panelRef = useRef<HTMLDivElement | null>(null);
  const preLayersRef = useRef<HTMLDivElement | null>(null);
  const preLayerElsRef = useRef<HTMLElement[]>([]);

  const needleRef = useRef<HTMLSpanElement | null>(null);
  const tachoRef = useRef<HTMLSpanElement | null>(null);
  const revTlRef = useRef<gsap.core.Timeline | null>(null);
  const rumbleTweenRef = useRef<gsap.core.Tween | null>(null);

  const needleVibeRef = useRef<gsap.core.Tween | null>(null);

  const textInnerRef = useRef<HTMLSpanElement | null>(null);
  const textWrapRef = useRef<HTMLSpanElement | null>(null);
  const [textLines, setTextLines] = useState<string[]>(["Menu", "Close"]);

  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);
  const textCycleAnimRef = useRef<gsap.core.Tween | null>(null);
  const colorTweenRef = useRef<gsap.core.Tween | null>(null);

  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
  const busyRef = useRef<boolean>(false);

  const itemEntranceTweenRef = useRef<gsap.core.Tween | null>(null);

  const handleMouseEnter = useCallback(() => {
    const needle = needleRef.current;
    const tacho = tachoRef.current;
    if (!needle) return;

    revTlRef.current?.kill();
    rumbleTweenRef.current?.kill();

    if (!openRef.current) {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.to(needle, { rotate: 20, duration: 0.16 })
        .to(needle, { rotate: -60, duration: 0.14 })
        .to(needle, { rotate: 50, duration: 0.18 })
        .to(needle, { rotate: -120, duration: 0.45, ease: "bounce.out" });
      revTlRef.current = tl;

      if (tacho) {
        rumbleTweenRef.current = gsap.to(tacho, {
          x: "random(-1.2, 1.2)",
          y: "random(-1.2, 1.2)",
          duration: 0.05,
          repeat: 12,
          yoyo: true,
          clearProps: "x,y",
        });
      }
    } else {
      if (tacho) {
        rumbleTweenRef.current = gsap.to(tacho, {
          x: "random(-0.8, 0.8)",
          y: "random(-0.8, 0.8)",
          duration: 0.05,
          repeat: 6,
          yoyo: true,
          clearProps: "x,y",
        });
      }
      gsap.to(needle, {
        rotate: "random(42, 58)",
        duration: 0.04,
        repeat: 6,
        yoyo: true,
        onComplete: () => {
          gsap.to(needle, { rotate: 50, duration: 0.1, ease: "power2.out" });
        },
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!openRef.current) {
      revTlRef.current?.kill();
      rumbleTweenRef.current?.kill();
      if (needleRef.current) {
        gsap.to(needleRef.current, {
          rotate: -120,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    }
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;

      const needle = needleRef.current;
      const textInner = textInnerRef.current;

      if (!panel || !needle || !textInner) return;

      let preLayers: HTMLElement[] = [];
      if (preContainer) {
        preLayers = Array.from(
          preContainer.querySelectorAll(".sm-prelayer"),
        ) as HTMLElement[];
      }
      preLayerElsRef.current = preLayers;

      const offscreen = position === "left" ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen });

      gsap.set(needle, { transformOrigin: "0% 50%", rotate: -120 });

      gsap.set(textInner, { yPercent: 0 });

      if (toggleBtnRef.current)
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });
    return () => ctx.revert();
  }, [menuButtonColor, position]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }
    itemEntranceTweenRef.current?.kill();

    const itemEls = Array.from(
      panel.querySelectorAll(".sm-panel-itemLabel"),
    ) as HTMLElement[];
    const numberEls = Array.from(
      panel.querySelectorAll(".sm-panel-list[data-numbering] .sm-panel-item"),
    ) as HTMLElement[];
    const socialTitle = panel.querySelector(
      ".sm-socials-title",
    ) as HTMLElement | null;
    const socialLinks = Array.from(
      panel.querySelectorAll(".sm-socials-link"),
    ) as HTMLElement[];

    const layerStates = layers.map((el) => ({
      el,
      start: Number(gsap.getProperty(el, "xPercent")),
    }));
    const panelStart = Number(gsap.getProperty(panel, "xPercent"));

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (numberEls.length)
      gsap.set(numberEls, { ["--sm-num-opacity" as any]: 0 });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, i) => {
      tl.fromTo(
        ls.el,
        { xPercent: ls.start },
        { xPercent: 0, duration: 0.5, ease: "power4.out" },
        i * 0.07,
      );
    });

    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.65;

    tl.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: "power4.out" },
      panelInsertTime,
    );

    if (itemEls.length) {
      const itemsStartRatio = 0.15;
      const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;

      tl.to(
        itemEls,
        {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: "power4.out",
          stagger: { each: 0.1, from: "start" },
        },
        itemsStart,
      );

      if (numberEls.length) {
        tl.to(
          numberEls,
          {
            duration: 0.6,
            ease: "power2.out",
            ["--sm-num-opacity" as any]: 1,
            stagger: { each: 0.08, from: "start" },
          },
          itemsStart + 0.1,
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;

      if (socialTitle)
        tl.to(
          socialTitle,
          { opacity: 1, duration: 0.5, ease: "power2.out" },
          socialsStart,
        );
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power3.out",
            stagger: { each: 0.08, from: "start" },
            onComplete: () => {
              gsap.set(socialLinks, { clearProps: "opacity" });
            },
          },
          socialsStart + 0.04,
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, []);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;

    if (panelRef.current) gsap.set(panelRef.current, { pointerEvents: "auto" });

    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback("onComplete", () => {
        busyRef.current = false;
      });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;
    itemEntranceTweenRef.current?.kill();

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const all: HTMLElement[] = [...layers, panel];
    closeTweenRef.current?.kill();

    const offscreen = position === "left" ? -100 : 100;

    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: "power3.in",
      overwrite: "auto",
      onComplete: () => {
        if (panelRef.current)
          gsap.set(panelRef.current, { pointerEvents: "none" });

        const itemEls = Array.from(
          panel.querySelectorAll(".sm-panel-itemLabel"),
        ) as HTMLElement[];
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });

        const numberEls = Array.from(
          panel.querySelectorAll(
            ".sm-panel-list[data-numbering] .sm-panel-item",
          ),
        ) as HTMLElement[];
        if (numberEls.length)
          gsap.set(numberEls, { ["--sm-num-opacity" as any]: 0 });

        const socialTitle = panel.querySelector(
          ".sm-socials-title",
        ) as HTMLElement | null;
        const socialLinks = Array.from(
          panel.querySelectorAll(".sm-socials-link"),
        ) as HTMLElement[];
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

        busyRef.current = false;
      },
    });
  }, [position]);

  const animateIcon = useCallback((opening: boolean) => {
    const needle = needleRef.current;
    if (!needle) return;

    revTlRef.current?.kill();
    needleVibeRef.current?.kill();
    needleVibeRef.current = null;

    if (opening) {
      gsap.to(needle, {
        rotate: 50,
        duration: 0.55,
        ease: "power4.out",
        onComplete: () => {
          needleVibeRef.current = gsap.to(needle, {
            rotate: "random(49.2, 51.5)",
            duration: 0.05,
            repeat: -1,
            yoyo: true,
            ease: "none",
          });
        },
      });
    } else {
      gsap.to(needle, {
        rotate: -120,
        duration: 0.45,
        ease: "power3.inOut",
      });
    }
  }, []);

  const animateColor = useCallback(
    (opening: boolean) => {
      const btn = toggleBtnRef.current;
      if (!btn) return;
      colorTweenRef.current?.kill();
      if (changeMenuColorOnOpen) {
        const targetColor = opening ? openMenuButtonColor : menuButtonColor;
        colorTweenRef.current = gsap.to(btn, {
          color: targetColor,
          delay: 0.18,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.set(btn, { color: menuButtonColor });
      }
    },
    [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen],
  );

  React.useEffect(() => {
    if (toggleBtnRef.current) {
      if (changeMenuColorOnOpen) {
        const targetColor = openRef.current
          ? openMenuButtonColor
          : menuButtonColor;
        gsap.set(toggleBtnRef.current, { color: targetColor });
      } else {
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
      }
    }
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);

  const animateText = useCallback((opening: boolean) => {
    const inner = textInnerRef.current;
    if (!inner) return;

    textCycleAnimRef.current?.kill();

    const currentLabel = opening ? "Menu" : "Close";
    const targetLabel = opening ? "Close" : "Menu";
    const cycles = 3;

    const seq: string[] = [currentLabel];
    let last = currentLabel;
    for (let i = 0; i < cycles; i++) {
      last = last === "Menu" ? "Close" : "Menu";
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);

    setTextLines(seq);
    gsap.set(inner, { yPercent: 0 });

    const lineCount = seq.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;

    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: "power4.out",
    });
  }, []);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;

    // Shift focus out of the menu before closing to avoid aria-hidden focus warnings
    if (!target) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      toggleBtnRef.current?.focus();
    }

    openRef.current = target;
    setOpen(target);

    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }

    animateIcon(target);
    animateColor(target);
    animateText(target);
  }, [
    playOpen,
    playClose,
    animateIcon,
    animateColor,
    animateText,
    onMenuOpen,
    onMenuClose,
  ]);

  const closeMenu = useCallback(() => {
    if (openRef.current) {
      // Shift focus out of the menu before closing to avoid aria-hidden focus warnings
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      toggleBtnRef.current?.focus();

      openRef.current = false;
      setOpen(false);
      onMenuClose?.();
      playClose();
      animateIcon(false);
      animateColor(false);
      animateText(false);
    }
  }, [playClose, animateIcon, animateColor, animateText, onMenuClose]);

  const closeMenuRef = React.useRef<() => void>(closeMenu);
  React.useLayoutEffect(() => {
    closeMenuRef.current = closeMenu;
  }, [closeMenu]);

  React.useEffect(() => {
    if (!closeOnClickAway || !open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (deleteIndex !== null) return;
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(event.target as Node)
      ) {
        closeMenuRef.current();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeOnClickAway, open, deleteIndex]);

  return (
    <div
      className={`sm-scope fixed top-0 left-0 w-full h-[100dvh] overflow-hidden z-40 ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        className="staggered-menu-wrapper relative size-full z-40"
        style={
          accentColor
            ? ({ ["--sm-accent" as any]: accentColor } as React.CSSProperties)
            : undefined
        }
        data-position={position}
        data-open={open || undefined}
      >
        <div
          ref={preLayersRef}
          className="sm-prelayers absolute top-0 right-0 bottom-0 pointer-events-none z-[5]"
          aria-hidden="true"
        >
          {(() => {
            const raw =
              colors && colors.length
                ? colors.slice(0, 4)
                : ["#1e1e22", "#35353c"];
            let arr = [...raw];
            if (arr.length >= 3) {
              const mid = Math.floor(arr.length / 2);
              arr.splice(mid, 1);
            }
            return arr.map((c, i) => (
              <div
                key={i}
                className="sm-prelayer absolute top-0 right-0 size-full translate-x-0"
                style={{ background: c }}
              />
            ));
          })()}
        </div>

        {/* FLOATING PILL HEADER */}
        <div
          className="
    fixed top-4 left-1/2 -translate-x-1/2
    z-50
    pointer-events-auto w-[90vw]
  "
        >
          <div
            className="
      flex items-center justify-between gap-6
      px-5 py-3
      rounded-full
      bg-[var(--color-navbar-bg)] backdrop-blur-xl
      border border-white/10
      shadow-xl
    "
          >
            {/* LEFT: NAME */}
            <Link
              to="/"
              className="flex items-center gap-2 group"
              aria-label="MotoXCode Home"
            >
              <div className="size-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="black">
                  <path
                    d="M2 12L8 4L14 12H2Z"
                    fill="var(--color-bg)"
                    fillOpacity="0.9"
                  />
                </svg>
              </div>
            </Link>

            {/* RIGHT: EXISTING MENU BUTTON */}
            <button
              ref={toggleBtnRef}
              className="sm-toggle"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="staggered-menu-panel"
              onClick={toggleMenu}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              type="button"
            >
              {/* TEXT ANIMATION */}
              <span
                ref={textWrapRef}
                className="sm-toggle-textWrap"
                aria-hidden="true"
              >
                <span ref={textInnerRef} className="sm-toggle-textInner">
                  {textLines.map((l, i) => (
                    <span className="sm-toggle-line" key={`${l}-${i}`}>
                      {l}
                    </span>
                  ))}
                </span>
              </span>

              {/* TACHOMETER ICON */}
              <span ref={tachoRef} className="sm-tacho" aria-hidden="true">
                {/* SVG Dial Ticks */}
                <svg
                  className="absolute inset-0 size-full text-white/30"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  {/* Outer ticks ring */}
                  <circle
                    cx="16"
                    cy="16"
                    r="13"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeDasharray="2 2"
                  />
                  {/* Redline sector */}
                  <path
                    d="M 25.19 6.81 A 13 13 0 0 1 29 16"
                    fill="none"
                    stroke="var(--color-highlight, #ff5a1f)"
                    strokeWidth="2"
                  />
                </svg>
                {/* Central pivot hub */}
                <span className="sm-tacho-hub" />
                {/* Shift light indicator */}
                <span className="sm-tacho-shiftlight" />
                {/* Tachometer needle */}
                <span ref={needleRef} className="sm-tacho-needle" />
              </span>
            </button>
          </div>
        </div>

        <aside
          id="staggered-menu-panel"
          ref={panelRef}
          className="staggered-menu-panel absolute top-0 right-0 h-[100dvh] max-h-[100dvh] bg-[var(--color-navbar-bg)]/80 flex flex-col p-[6em_2em_2em_2em] overflow-y-auto z-10 backdrop-blur-[8px]"
          style={{
            WebkitBackdropFilter: "blur(8px)",
            pointerEvents: open ? "auto" : "none",
          }}
          aria-hidden={!open}
          inert={!open ? true : undefined}
        >
          <div className="sm-panel-inner flex-1 flex flex-col gap-5">
            <ul
              className="sm-panel-list list-none m-0 p-0 flex flex-col gap-2"
              data-numbering={displayItemNumbering || undefined}
            >
              {items && items.length ? (
                (() => {
                  let itemsToRender = [...items];
                  if (isInitialized && userDetails) {
                    itemsToRender = itemsToRender.filter(
                      (item) => item.to !== "/contact",
                    );
                  }
                  if (isInitialized) {
                    if (userDetails) {
                      itemsToRender.push({
                        label: "Profile",
                        to: `/profile/@${userDetails.username}`,
                      });
                    } else {
                      itemsToRender.push({ label: "Join", to: "/join" });
                    }
                  }
                  return itemsToRender;
                })().map((it, idx) => (
                  <li
                    className="sm-panel-itemWrap relative overflow-hidden leading-none"
                    key={it.label + idx}
                  >
                    <Link
                      className={`sm-panel-item relative font-semibold cursor-pointer leading-none tracking-[-2px] uppercase transition-[background,color] duration-150 ease-linear inline-block no-underline text-[2.5rem] pr-[2.2em] sm:text-[3rem] pr-[1.2em] ${
                        location.pathname === it.to
                          ? "sm-panel-item-active"
                          : ""
                      }`}
                      to={it.to}
                      onClick={toggleMenu}
                      aria-label={it.label}
                      data-index={idx + 1}
                    >
                      <span className="sm-panel-itemLabel inline-block [transform-origin:50%_100%] will-change-transform">
                        {it.label}
                      </span>
                    </Link>
                  </li>
                ))
              ) : (
                <li
                  className="sm-panel-itemWrap relative overflow-hidden leading-none"
                  aria-hidden="true"
                >
                  <span className="sm-panel-item relative font-semibold cursor-pointer leading-none tracking-[-2px] uppercase transition-[background,color] duration-150 ease-linear inline-block no-underline text-[2.5rem] pr-[2.2em] sm:text-[3rem] pr-[1.2em]">
                    <span className="sm-panel-itemLabel inline-block [transform-origin:50%_100%] will-change-transform">
                      Menu is not available right now
                    </span>
                  </span>
                </li>
              )}
            </ul>

            {displaySocials && (
              <div
                className="sm-socials mt-auto pt-8 flex flex-col gap-3"
                aria-label="Social links"
              >
                <div className="flex items-center gap-3">
                  <h3 className="sm-socials-title m-0 text-base font-medium">
                    Socials
                  </h3>
                  {isAdmin && !isEditingSocials && (
                    <button
                      onClick={startEditingSocials}
                      title="Edit Socials"
                      aria-label="Edit socials"
                      className="size-6 flex items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 transition-all cursor-pointer"
                    >
                      <FaPencil size={10} />
                    </button>
                  )}
                </div>

                {isEditingSocials ? (
                  <div className="flex flex-col gap-3 w-full mt-2 pointer-events-auto">
                    <p className="text-[var(--color-text-secondary)] text-xs font-mono uppercase tracking-widest mb-2">
                      Editing Socials
                    </p>
                    <div className="flex flex-col gap-4 w-full mt-2">
                      {editSocials.map((s, idx) => {
                        const isOther = !SOCIAL_OPTIONS.slice(0, -1).some(
                          (opt) =>
                            opt.toLowerCase() === s.label.toLowerCase().trim(),
                        );
                        const selectValue = isOther
                          ? "Other"
                          : SOCIAL_OPTIONS.find(
                              (opt) =>
                                opt.toLowerCase() ===
                                s.label.toLowerCase().trim(),
                            ) || "Globe";
                        return (
                          <div
                            key={idx}
                            className="flex flex-col w-full gap-4 bg-[var(--color-surface)]/50 p-4 rounded-xl border border-[var(--color-border)]/50"
                          >
                            <div className="flex flex-col sm:flex-row w-full gap-4 items-start sm:items-center">
                              <div className="flex flex-col gap-1 w-full sm:w-1/3 lg:w-1/4">
                                <label
                                  htmlFor={`staggered-social-label-select-${idx}`}
                                  className="text-[0.65rem] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]"
                                >
                                  Platform
                                </label>
                                <select
                                  id={`staggered-social-label-select-${idx}`}
                                  name={`staggered-social-label-select-${idx}`}
                                  autoComplete="off"
                                  value={selectValue}
                                  onChange={(e) => {
                                    if (e.target.value === "Other") {
                                      handleSocialChange(idx, "label", "");
                                    } else {
                                      handleSocialChange(
                                        idx,
                                        "label",
                                        e.target.value,
                                      );
                                    }
                                  }}
                                  className="w-full bg-[var(--color-bg)]/80 border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                >
                                  {SOCIAL_OPTIONS.map((opt) => (
                                    <option key={opt} value={opt}>
                                      {opt}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              {isOther && (
                                <div className="flex flex-col gap-1 w-full sm:w-1/3 lg:w-1/4">
                                  <label
                                    htmlFor={`staggered-social-label-input-${idx}`}
                                    className="text-[0.65rem] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]"
                                  >
                                    Custom Label
                                  </label>
                                  <input
                                    id={`staggered-social-label-input-${idx}`}
                                    name={`staggered-social-label-input-${idx}`}
                                    autoComplete="off"
                                    type="text"
                                    value={s.label}
                                    onChange={(e) =>
                                      handleSocialChange(
                                        idx,
                                        "label",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="Custom Label"
                                    className="w-full bg-[var(--color-bg)]/80 border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors min-w-0"
                                  />
                                </div>
                              )}
                              <div className="flex flex-col gap-1 w-full sm:flex-1">
                                <label
                                  htmlFor={`staggered-social-link-input-${idx}`}
                                  className="text-[0.65rem] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]"
                                >
                                  URL
                                </label>
                                <input
                                  id={`staggered-social-link-input-${idx}`}
                                  name={`staggered-social-link-input-${idx}`}
                                  autoComplete="off"
                                  type="text"
                                  value={s.link}
                                  onChange={(e) =>
                                    handleSocialChange(
                                      idx,
                                      "link",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="URL"
                                  className="w-full bg-[var(--color-bg)]/80 border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors min-w-0"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end pt-2 border-t border-[var(--color-border)]/30 mt-2 w-full">
                              <button
                                onClick={() => confirmDeleteDraft(idx)}
                                className="flex w-full text-center justify-center items-center gap-2 px-4 py-2 text-red-500 hover:text-[var(--color-bg)] hover:bg-red-500 rounded-lg transition-colors border border-red-500/30 text-xs font-bold uppercase tracking-widest hover:cursor-pointer hover:text-white"
                                title="Remove Social"
                                aria-label="Remove social link"
                              >
                                <FaTrash size={12} /> Remove Social
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      <button
                        onClick={addSocial}
                        className="mt-2 flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-[var(--color-border)] rounded-2xl text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/5 transition-all font-bold tracking-widest uppercase text-xs cursor-pointer"
                      >
                        <FaPlus size={12} /> Add New Social
                      </button>

                      <div className="flex gap-3 justify-end mt-2">
                        <button
                          onClick={() => setIsEditingSocials(false)}
                          disabled={isSaving}
                          className="px-6 py-2.5 text-sm font-bold rounded-xl border border-[var(--color-border)] text-[var(--color-primary)] transition-all hover:bg-[var(--color-bg)]/60 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveSocials}
                          disabled={isSaving}
                          className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${
                            isSaving
                              ? "bg-[var(--color-primary)]/50 text-[var(--color-bg)]/70 cursor-not-allowed opacity-60"
                              : "bg-[var(--color-primary)] text-[var(--color-bg)] hover:opacity-90 hover:cursor-pointer"
                          }`}
                        >
                          {isSaving ? (
                            <span className="flex gap-1 items-center justify-center">
                              <Cliploader size={12} color="var(--color-bg)" />{" "}
                              Saving..
                            </span>
                          ) : (
                            "Save"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <ul className="sm-socials-list list-none m-0 p-0 flex flex-row items-center gap-4 flex-wrap">
                    {socialItems &&
                      socialItems.map((s) => (
                        <li key={s._id} className="sm-socials-item">
                          <a
                            href={s.link}
                            onClick={toggleMenu}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="sm-socials-link text-[1.2rem] font-medium no-underline relative inline-block py-[2px] transition-[color,opacity] duration-300 ease-linear hover:text-[var(--color-primary)]"
                          >
                            {s.label}
                          </a>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>

      <ConfirmModal
        isOpen={deleteIndex !== null}
        title="Delete Social Link?"
        message="Are you sure you want to remove this social link? This cannot be undone once saved."
        confirmText="Remove Social"
        onConfirm={executeDeleteDraft}
        onClose={() => setDeleteIndex(null)}
      />
    </div>
  );
};

export default StaggeredMenu;
