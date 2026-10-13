import type { JSX, VNode } from "preact";

const OverflowList = ({
  children,
  ...props
}: JSX.HTMLAttributes<HTMLUListElement> & { id: string }) => {
  return (
    <ul {...props} class={[props.class, "overflow"].filter(Boolean).join(" ")} id={props.id}>
      {children}
      <li class="overflow-end" />
    </ul>
  );
};

let numLists = 0;

export interface OverflowListFactory {
  OverflowList: (props: JSX.HTMLAttributes<HTMLUListElement>) => VNode;
  overflowListAfterDOMLoaded: string;
}

export default (): OverflowListFactory => {
  const id = `list-${numLists++}`;

  return {
    OverflowList: (props: JSX.HTMLAttributes<HTMLUListElement>) => (
      <OverflowList {...props} id={id} />
    ),
    overflowListAfterDOMLoaded: `
document.addEventListener("nav", (e) => {
  const ul = document.getElementById("${id}")
  if (!ul) return

  const end = ul.querySelector(":scope > .overflow-end")
  if (!end) return

  ul.appendChild(end)
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      ul.classList.toggle("gradient-active", !entry.isIntersecting)
    }
  }, { root: ul, threshold: 0 })

  observer.observe(end)
  window.addCleanup(() => observer.disconnect())
})
`,
  };
};
