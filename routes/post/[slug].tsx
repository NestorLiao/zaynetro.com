import { Footer, Header } from "@/components/Header.tsx";
import { blogPosts, renderPost } from "@/utils/blog.ts";
import { PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import BlogPostImports from "@/islands/BlogPostImports.tsx";

// Ref: https://deno.land/x/gfm@0.2.3/style.js?source#L2
const CSS = `
:root {
   --color-canvas-default-transparent:rgba(255,255,255,0);
  --color-prettylights-syntax-comment:#6e7781;
  --color-prettylights-syntax-constant:#0550ae;
  --color-prettylights-syntax-entity:#8250df;
  --color-prettylights-syntax-storage-modifier-import:#24292f;
  --color-prettylights-syntax-entity-tag:#116329;
  --color-prettylights-syntax-keyword:#cf222e;
  --color-prettylights-syntax-string:#0a3069;
  --color-prettylights-syntax-variable:#953800;
  --color-prettylights-syntax-string-regexp:#116329;
  --color-prettylights-syntax-markup-deleted-text:#82071e;
  --color-prettylights-syntax-markup-deleted-bg:#ffebe9;
  --color-prettylights-syntax-markup-inserted-text:#116329;
  --color-prettylights-syntax-markup-inserted-bg:#dafbe1;
  --color-prettylights-syntax-constant-other-reference-link:#0a3069;
  --color-fg-default:#24292f;
  --color-fg-muted:#57606a;
  --color-canvas-default:#fff;
  --color-canvas-subtle:#f6f8fa;
  --color-border-default:#d0d7de;
  --color-border-muted:#d8dee4;
  --color-neutral-muted:rgba(175,184,193,.2);
  --color-accent-fg:#0969da;
  --color-accent-emphasis:#0969da;
  --color-danger-fg:#cf222e
}
@media (prefers-color-scheme:light){
  :root {
    --color-canvas-default-transparent:rgba(255,255,255,0);
    --color-prettylights-syntax-comment:#6e7781;
    --color-prettylights-syntax-constant:#0550ae;
    --color-prettylights-syntax-entity:#8250df;
    --color-prettylights-syntax-storage-modifier-import:#24292f;
    --color-prettylights-syntax-entity-tag:#116329;
    --color-prettylights-syntax-keyword:#cf222e;
    --color-prettylights-syntax-string:#0a3069;
    --color-prettylights-syntax-variable:#953800;
    --color-prettylights-syntax-string-regexp:#116329;
    --color-prettylights-syntax-markup-deleted-text:#82071e;
    --color-prettylights-syntax-markup-deleted-bg:#ffebe9;
    --color-prettylights-syntax-markup-inserted-text:#116329;
    --color-prettylights-syntax-markup-inserted-bg:#dafbe1;
    --color-prettylights-syntax-constant-other-reference-link:#0a3069;
    --color-fg-default:#24292f;
    --color-fg-muted:#57606a;
    --color-canvas-default:#fff;
    --color-canvas-subtle:#f6f8fa;
    --color-border-default:#d0d7de;
    --color-border-muted:#d8dee4;
    --color-neutral-muted:rgba(175,184,193,.2);
    --color-accent-fg:#0969da;
    --color-accent-emphasis:#0969da;
    --color-danger-fg:#cf222e
  }
}
@media (prefers-color-scheme:dark){
  :root{
    --color-canvas-default-transparent:rgba(13,17,23,0);
    --color-prettylights-syntax-comment:#8b949e;
    --color-prettylights-syntax-constant:#79c0ff;
    --color-prettylights-syntax-entity:#d2a8ff;
    --color-prettylights-syntax-storage-modifier-import:#c9d1d9;
    --color-prettylights-syntax-entity-tag:#7ee787;
    --color-prettylights-syntax-keyword:#ff7b72;
    --color-prettylights-syntax-string:#a5d6ff;
    --color-prettylights-syntax-variable:#ffa657;
    --color-prettylights-syntax-string-regexp:#7ee787;
    --color-prettylights-syntax-markup-deleted-text:#ffdcd7;
    --color-prettylights-syntax-markup-deleted-bg:#67060c;
    --color-prettylights-syntax-markup-inserted-text:#aff5b4;
    --color-prettylights-syntax-markup-inserted-bg:#033a16;
    --color-prettylights-syntax-constant-other-reference-link:#a5d6ff;
    --color-fg-default:#c9d1d9;
    --color-fg-muted:#8b949e;
    --color-canvas-default:#0d1117;
    --color-canvas-subtle:#161b22;
    --color-border-default:#30363d;
    --color-border-muted:#21262d;
    --color-neutral-muted:rgba(110,118,129,.4);
    --color-accent-fg:#58a6ff;
    --color-accent-emphasis:#1f6feb;
    --color-danger-fg:#f85149
  }
}
.markdown-body{
  word-wrap:break-word;
  font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Noto Sans,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji;
  font-size:16px;
  line-height:1.5
}
.markdown-body:before{
  content:"";
  display:table
}
.markdown-body:after{
  clear:both;
  content:"";
  display:table
}
.markdown-body>:first-child{
  margin-top:0!important
}
.markdown-body>:last-child{
  margin-bottom:0!important
}
.markdown-body a:not([href]){
  color:inherit;
  text-decoration:none
}
.markdown-body .absent{
  color:var(--color-danger-fg)
}
.markdown-body .anchor{
  float:left;
  margin-left:-20px;
  padding-right:4px;
  line-height:1
}
.markdown-body .anchor:focus{
  outline:none
}
.markdown-body p,.markdown-body blockquote,.markdown-body ul,.markdown-body ol,.markdown-body dl,.markdown-body table,.markdown-body pre,.markdown-body details{
  margin-top:0;
  margin-bottom:16px
}
.markdown-body hr{
  height:.25em;
  background-color:var(--color-border-default);
  border:0;
  margin:24px 0;
  padding:0
}
.markdown-body blockquote{
  color:var(--color-fg-muted);
  border-left:.25em solid var(--color-border-default);
  padding:0 1em
}
.markdown-body blockquote>:first-child{
  margin-top:0
}
.markdown-body blockquote>:last-child{
  margin-bottom:0
}
.markdown-body h1,.markdown-body h2,.markdown-body h3,.markdown-body h4,.markdown-body h5,.markdown-body h6{
  font-weight:var(--base-text-weight-semibold,600);
  margin-top:24px;
  margin-bottom:16px;
  line-height:1.25
}
.markdown-body h1 .octicon-link,.markdown-body h2 .octicon-link,.markdown-body h3 .octicon-link,.markdown-body h4 .octicon-link,.markdown-body h5 .octicon-link,.markdown-body h6 .octicon-link{
  color:var(--color-fg-default);
  vertical-align:middle;
  visibility:hidden
}
.markdown-body h1:hover .anchor,.markdown-body h2:hover .anchor,.markdown-body h3:hover .anchor,.markdown-body h4:hover .anchor,.markdown-body h5:hover .anchor,.markdown-body h6:hover .anchor{
  text-decoration:none
}
.markdown-body h1:hover .anchor .octicon-link,.markdown-body h2:hover .anchor .octicon-link,.markdown-body h3:hover .anchor .octicon-link,.markdown-body h4:hover .anchor .octicon-link,.markdown-body h5:hover .anchor .octicon-link,.markdown-body h6:hover .anchor .octicon-link{
  visibility:visible
}
.markdown-body h1 tt,.markdown-body h1 code,.markdown-body h2 tt,.markdown-body h2 code,.markdown-body h3 tt,.markdown-body h3 code,.markdown-body h4 tt,.markdown-body h4 code,.markdown-body h5 tt,.markdown-body h5 code,.markdown-body h6 tt,.markdown-body h6 code{
  font-size:inherit;
  padding:0 .2em
}
.markdown-body h1{
  border-bottom:1px solid var(--color-border-muted);
  padding-bottom:.3em;
  font-size:2em
}
.markdown-body h2{
  border-bottom:1px solid var(--color-border-muted);
  padding-bottom:.3em;
  font-size:1.5em
}
.markdown-body h3{
  font-size:1.25em
}
.markdown-body h4{
  font-size:1em
}
.markdown-body h5{
  font-size:.875em
}
.markdown-body h6{
  color:var(--color-fg-muted);
  font-size:.85em
}
.markdown-body summary h1,.markdown-body summary h2,.markdown-body summary h3,.markdown-body summary h4,.markdown-body summary h5,.markdown-body summary h6{
  display:inline-block
}
.markdown-body summary h1 .anchor,.markdown-body summary h2 .anchor,.markdown-body summary h3 .anchor,.markdown-body summary h4 .anchor,.markdown-body summary h5 .anchor,.markdown-body summary h6 .anchor{
  margin-left:-40px
}
.markdown-body summary h1,.markdown-body summary h2{
  border-bottom:0;
  padding-bottom:0
}
.markdown-body ul,.markdown-body ol{
  padding-left:2em
}
.markdown-body ul.no-list,.markdown-body ol.no-list{
  padding:0;
  list-style-type:none
}
.markdown-body ol[type=a]{
  list-style-type:lower-alpha
}
.markdown-body ol[type=A]{
  list-style-type:upper-alpha
}
.markdown-body ol[type=i]{
  list-style-type:lower-roman
}
.markdown-body ol[type=I]{
  list-style-type:upper-roman
}
.markdown-body ol[type="1"]{
  list-style-type:decimal
}
.markdown-body div>ol:not([type]){
  list-style-type:decimal
}
.markdown-body ul ul,.markdown-body ul ol,.markdown-body ol ol,.markdown-body ol ul{
  margin-top:0;
  margin-bottom:0
}
.markdown-body li>p{
  margin-top:16px
}
.markdown-body li+li{
  margin-top:.25em
}
.markdown-body dl{
  padding:0
}
.markdown-body dl dt{
  font-size:1em;
  font-style:italic;
  font-weight:var(--base-text-weight-semibold,600);
  margin-top:16px;
  padding:0
}
.markdown-body dl dd{
  margin-bottom:16px;
  padding:0 16px
}
.markdown-body table{
  width:100%;
  width:-webkit-max-content;
  width:-webkit-max-content;
  width:max-content;
  max-width:100%;
  display:block;
  overflow:auto
}
.markdown-body table th{
  font-weight:var(--base-text-weight-semibold,600)
}
.markdown-body table th,.markdown-body table td{
  border:1px solid var(--color-border-default);
  padding:6px 13px
}
.markdown-body table td>:last-child{
  margin-bottom:0
}
.markdown-body table tr{
  background-color:var(--color-canvas-default);
  border-top:1px solid var(--color-border-muted)
}
.markdown-body table tr:nth-child(2n){
  background-color:var(--color-canvas-subtle)
}
.markdown-body table img{
  background-color:transparent
}
.markdown-body img{
  max-width:100%;
  box-sizing:content-box;
  background-color:var(--color-canvas-default)
}
.markdown-body img[align=right]{
  padding-left:20px
}
.markdown-body img[align=left]{
  padding-right:20px
}
.markdown-body .emoji{
  max-width:none;
  vertical-align:text-top;
  background-color:transparent
}
.markdown-body span.frame{
  display:block;
  overflow:hidden
}
.markdown-body span.frame>span{
  float:left;
  width:auto;
  border:1px solid var(--color-border-default);
  margin:13px 0 0;
  padding:7px;
  display:block;
  overflow:hidden
}
.markdown-body span.frame span img{
  float:left;
  display:block
}
.markdown-body span.frame span span{
  clear:both;
  color:var(--color-fg-default);
  padding:5px 0 0;
  display:block
}
.markdown-body span.align-center{
  clear:both;
  display:block;
  overflow:hidden
}
.markdown-body span.align-center>span{
  text-align:center;
  margin:13px auto 0;
  display:block;
  overflow:hidden
}
.markdown-body span.align-center span img{
  text-align:center;
  margin:0 auto
}
.markdown-body span.align-right{
  clear:both;
  display:block;
  overflow:hidden
}
.markdown-body span.align-right>span{
  text-align:right;
  margin:13px 0 0;
  display:block;
  overflow:hidden
}
.markdown-body span.align-right span img{
  text-align:right;
  margin:0
}
.markdown-body span.float-left{
  float:left;
  margin-right:13px;
  display:block;
  overflow:hidden
}
.markdown-body span.float-left span{
  margin:13px 0 0
}
.markdown-body span.float-right{
  float:right;
  margin-left:13px;
  display:block;
  overflow:hidden
}
.markdown-body span.float-right>span{
  text-align:right;
  margin:13px auto 0;
  display:block;
  overflow:hidden
}
.markdown-body code,.markdown-body tt{
  white-space:break-spaces;
  background-color:var(--color-neutral-muted);
  border-radius:6px;
  margin:0;
  padding:.2em .4em;
  font-size:85%
}
.markdown-body code br,.markdown-body tt br{
  display:none
}
.markdown-body del code{
  -webkit-text-decoration:inherit;
  -webkit-text-decoration:inherit;
  text-decoration:inherit
}
.markdown-body samp{
  font-size:85%
}
.markdown-body pre{
  word-wrap:normal
}
.markdown-body pre code{
  font-size:100%
}
.markdown-body pre>code{
  word-break:normal;
  white-space:pre;
  background:0 0;
  border:0;
  margin:0;
  padding:0
}
.markdown-body .highlight{
  margin-bottom:16px
}
.markdown-body .highlight pre{
  word-break:normal;
  margin-bottom:0
}
.markdown-body .highlight pre,.markdown-body pre{
  background-color:var(--color-canvas-subtle);
  border-radius:6px;
  padding:16px;
  font-size:85%;
  line-height:1.45;
  overflow:auto
}
.markdown-body pre code,.markdown-body pre tt{
  max-width:auto;
  line-height:inherit;
  word-wrap:normal;
  background-color:transparent;
  border:0;
  margin:0;
  padding:0;
  display:inline;
  overflow:visible
}
.markdown-body .csv-data td,.markdown-body .csv-data th{
  text-align:left;
  white-space:nowrap;
  padding:5px;
  font-size:12px;
  line-height:1;
  overflow:hidden
}
.markdown-body .csv-data .blob-num{
  text-align:right;
  background:var(--color-canvas-default);
  border:0;
  padding:10px 8px 9px
}
.markdown-body .csv-data tr{
  border-top:0
}
.markdown-body .csv-data th{
  font-weight:var(--base-text-weight-semibold,600);
  background:var(--color-canvas-subtle);
  border-top:0
}
.markdown-body [data-footnote-ref]:before{
  content:"["
}
.markdown-body [data-footnote-ref]:after{
  content:"]"
}
.markdown-body .footnotes{
  color:var(--color-fg-muted);
  border-top:1px solid var(--color-border-default);
  font-size:12px
}
.markdown-body .footnotes ol{
  padding-left:16px
}
.markdown-body .footnotes ol ul{
  margin-top:16px;
  padding-left:16px;
  display:inline-block
}
.markdown-body .footnotes li{
  position:relative
}
.markdown-body .footnotes li:target:before{
  pointer-events:none;
  content:"";
  border:2px solid var(--color-accent-emphasis);
  border-radius:6px;
  position:absolute;
  top:-8px;
  bottom:-8px;
  left:-24px;
  right:-8px
}
.markdown-body .footnotes li:target{
  color:var(--color-fg-default)
}
.markdown-body .footnotes .data-footnote-backref g-emoji{
  font-family:monospace
}
/*
.markdown-body{
  background-color:var(--color-canvas-default);
  color:var(--color-fg-default)
}
.markdown-body a{
  color:var(--color-accent-fg);
  text-decoration:none
}
.markdown-body a:hover{
  text-decoration:underline
}
*/
.markdown-body img[align=center]{
  margin:0 auto
}
.markdown-body iframe{
  background-color:#fff;
  border:0;
  margin-bottom:16px
}
.markdown-body svg.octicon{
  fill:currentColor
}
.markdown-body .anchor>.octicon{
  display:inline
}
.markdown-body figcaption{
  text-align:center;
  padding-top:2px
}
.markdown-body .highlight .token.keyword,.gfm-highlight .token.keyword{
  color:var(--color-prettylights-syntax-keyword)
}
.markdown-body .highlight .token.tag .token.class-name,.markdown-body .highlight .token.tag .token.script .token.punctuation,.gfm-highlight .token.tag .token.class-name,.gfm-highlight .token.tag .token.script .token.punctuation{
  color:var(--color-prettylights-syntax-storage-modifier-import)
}
.markdown-body .highlight .token.operator,.markdown-body .highlight .token.number,.markdown-body .highlight .token.boolean,.markdown-body .highlight .token.tag .token.punctuation,.markdown-body .highlight .token.tag .token.script .token.script-punctuation,.markdown-body .highlight .token.tag .token.attr-name,.gfm-highlight .token.operator,.gfm-highlight .token.number,.gfm-highlight .token.boolean,.gfm-highlight .token.tag .token.punctuation,.gfm-highlight .token.tag .token.script .token.script-punctuation,.gfm-highlight .token.tag .token.attr-name{
  color:var(--color-prettylights-syntax-constant)
}
.markdown-body .highlight .token.function,.gfm-highlight .token.function{
  color:var(--color-prettylights-syntax-entity)
}
.markdown-body .highlight .token.string,.gfm-highlight .token.string{
  color:var(--color-prettylights-syntax-string)
}
.markdown-body .highlight .token.comment,.gfm-highlight .token.comment{
  color:var(--color-prettylights-syntax-comment)
}
.markdown-body .highlight .token.class-name,.gfm-highlight .token.class-name{
  color:var(--color-prettylights-syntax-variable)
}
.markdown-body .highlight .token.regex,.gfm-highlight .token.regex{
  color:var(--color-prettylights-syntax-string)
}
.markdown-body .highlight .token.regex .regex-delimiter,.gfm-highlight .token.regex .regex-delimiter{
  color:var(--color-prettylights-syntax-constant)
}
.markdown-body .highlight .token.tag .token.tag,.markdown-body .highlight .token.property,.gfm-highlight .token.tag .token.tag,.gfm-highlight .token.property{
  color:var(--color-prettylights-syntax-entity-tag)
}
.markdown-body .highlight .token.deleted,.gfm-highlight .token.deleted{
  color:var(--color-prettylights-syntax-markup-deleted-text);
  background-color:var(--color-prettylights-syntax-markup-deleted-bg)
}
.markdown-body .highlight .token.inserted,.gfm-highlight .token.inserted{
  color:var(--color-prettylights-syntax-markup-inserted-text);
  background-color:var(--color-prettylights-syntax-markup-inserted-bg)
}
`;

const customCSS = `
.markdown-body code {
  font-size: 80%
}

.markdown-body a.anchor {
  background: transparent;
}

.markdown-body ul {
  list-style-type: disc;
}

.markdown-body ul ul {
  list-style-type: circle;
}

.markdown-body ol {
  list-style-type: decimal;
}

.markdown-body a.img-link {
  background: transparent;
}

.mermaid-block {
  margin-bottom: 16px;
}

.mermaid-block pre {
  background: transparent;
}

.mermaid-block svg {
  margin: 0 auto;
  display: block;
}

.mermaid-label {
  text-align: center;
  font-size: 90%;
  color: #444;
}

.img-block-list {
  display: flex;
  justify-content: center;
  overflow-x: auto;
}

.img-block-label {
  padding-top: 8px;
  text-align: center;
  color: #444;
  font-size: 14px;
}

.img-block {
  margin-bottom: 16px;
}

.markdown-body h2:target, .markdown-body h3:target {
  text-decoration: underline #dc3545;
}

.powered-by {
  margin-bottom: 16px;
  font-size: 80%;
  color: #555;
}

@media (prefers-color-scheme:dark) {
  .mermaid-label,
  .img-block-label {
    color: #aaa;
  }

  .powered-by {
    color: #bbb;
  }
}
`;

export default function PostPage(props: PageProps) {
  const post = blogPosts.get(props.params.slug);

  if (!post) {
    return (
      <>
        <Header title="Not found" />

        <main class="mt-8">
          <section class="max-w-xl mx-auto">
            <h1>Not found</h1>
          </section>
        </main>

        <Footer />
      </>
    );
  }

  renderPost(post);

  return (
    <>
      <Head>
        {!!post.description && (
          <meta name="description" content={post.description} />
        )}

        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <style dangerouslySetInnerHTML={{ __html: customCSS }} />
      </Head>
      <Header title={post.title} />

      <div class="mt-4 px-4">
        <div class="mt-8 max-w-4xl mx-auto">
          <div class="text-gray-600 dark:text-gray-400 text-sm pb-2">
            {formatDate(post.date)}
          </div>
          <h1 class="text-3xl dark:text-gray-200">{post.title}</h1>
        </div>

        <div class="mt-4 flex flex-col xl:flex-row">
          <section class="static xl:sticky xl:grow xl:shrink xl:basis-0 xl:self-start pt-2 xl:top-0 xl:mr-2 xl:mr-4">
            <ul class="mx-auto list-disc list-inside max-w-3xl xl:max-w-lg text-gray-700">
              <li>
                <a href="#">↑ Top</a>
              </li>
              {post.toc!.map((heading) => (
                <li>
                  <a href={`#${heading.entry.slug}`}>{heading.entry.text}</a>

                  {!!heading.subheadings && (
                    <ul class="list-circle list-inside ml-6">
                      {heading.subheadings.map((sub) => (
                        <li>
                          <a href={`#${sub.slug}`}>
                            {sub.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <main class="max-w-4xl mx-0 md:mx-auto mt-4 xl:mt-0 xl:grow">
            <div
              class="my-2 markdown-body"
              dangerouslySetInnerHTML={{ __html: post.html! }}
            />

            <div class="mt-4">
              <bk-like-button></bk-like-button>
              <script
                async
                src="https://eyuxylujanwriimduamk.supabase.co/storage/v1/object/public/cdn/ui/1vnbplr14g4rb4/bk-like-button.js"
              >
              </script>
            </div>
          </main>

          <div class="hidden xl:block xl:grow xl:shrink xl:basis-0" />
        </div>
      </div>

      <Footer />

      <BlogPostImports mermaid={post.mermaid} />
    </>
  );
}

export function formatDate(d: Date) {
  const month = ("" + (d.getMonth() + 1)).padStart(2, "0");
  const day = ("" + (d.getDate() + 1)).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

// This import is needed to allow extending module declaration.
import "preact";

declare module "preact" {
  namespace JSX {
    interface IntrinsicElements {
      "bk-like-button": BkLikeButtonAttrs;
    }
  }
}

interface BkLikeButtonAttrs extends preact.JSX.HTMLAttributes<HTMLElement> {
  href?: string;
}
