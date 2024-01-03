load("@npm//plasmo:index.bzl", "plasmo")
load("@rules_player//javascript:js_library_pipeline.bzl", "PLACEHOLDER_VERSION")
load("@rules_player//javascript/package_json:index.bzl", "create_package_json")
load(":link_files.bzl", "link_files")

dependencies = [
    "@npm//@player-ui/react",
    "@npm//plasmo",
    "@npm//react",
    "@npm//react-dom",
    "@npm//webextension-polyfill",
    "//devtools/messenger:@player-tools/devtools-messenger",
    "//devtools/types:@player-tools/devtools-types",
    "//devtools/client:@player-tools/devtools-client",
]

peer_dependencies = None

additional_properties = str({
    "scripts": {
        "dev": "plasmo dev",
        "build": "plasmo build",
        "test": "plasmo test",
        "inject:chrome": "pnpm build && web-ext run -t chromium --start-url \"https://example.com\" --source-dir ./build/chrome-mv3-prod",
        "inject:firefox": "pnpm build --target=firefox-mv2 && pnpm web-ext run --start-url \"about:debugging#/runtime/this-firefox\"  --source-dir ./build/firefox-mv2-prod"
    },
    "manifest": {
        "host_permissions": [
        "https://*/*"
        ],
        "permissions": [
        "devtools"
        ]
    },
})

create_package_json(
    name = "package_json",
    package_name = "@player-tools/devtools-browser-extension",
    registry = "https://registry.npmjs.org",
    placeholder_version = PLACEHOLDER_VERSION,
    dependencies = dependencies,
    peer_dependencies = peer_dependencies,
    out_dir = "devtools/browser-extension",
    root_package_json = "//:package.json",
    additional_properties = additional_properties
)

link_files(
    name = "link_files",
    srcs = glob(["**/*"]),
)

data = dependencies + [":package_json", ":link_files"]

plasmo(
    name = "plasmo_bundle",
    chdir = "bazel-out/darwin-fastbuild/bin/devtools/browser-extension/linked_files",
    args = [
      "build",
      "--target", "chrome-mv3",
      "--tag", "prod",
    ],
    data = data,
    output_dir = True,
    visibility = ["//visibility:public"],
)
