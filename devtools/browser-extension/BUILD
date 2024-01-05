load("@npm//plasmo:index.bzl", "plasmo")
load("@rules_player//javascript:js_library_pipeline.bzl", "PLACEHOLDER_VERSION")
load("@rules_player//javascript/package_json:index.bzl", "create_package_json")

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

create_package_json(
    name = "package_json",
    package_name = "@player-tools/devtools-browser-extension",
    base_package_json = ":package.json",
    dependencies = dependencies,
    out_dir = "dist",
    peer_dependencies = peer_dependencies,
    placeholder_version = PLACEHOLDER_VERSION,
    registry = "https://registry.npmjs.org",
    root_package_json = "//:package.json",
)

# link_files(
#     name = "link_files",
#     srcs = glob(["**/*"]),
# )

data = dependencies + [
    "package.json",
    "tsconfig.json",
    "index.tsx",
] + glob([
    "assets/**/*",
    "background/**/*",
    "contents/**/*",
    "devtools/**/*",
    "panels/**/*",
])

plasmo(
    name = "plasmo_bundle",
    args = [
        "--verbose",
        "build",
        "--target",
        "chrome-mv3",
        "--tag",
        "prod",
    ],
    chdir = "devtools/browser-extension",
    data = data,
    output_dir = True,
    visibility = ["//visibility:public"],
)
