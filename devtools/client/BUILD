load("//:index.bzl", "javascript_pipeline")

javascript_pipeline(
    name = "@player-tools/devtools-client",
    dependencies = [
      "@npm//@player-ui/react",
      "@npm//@player-ui/reference-assets-plugin-react",
      "@npm//dset",
      "@npm//immer",
      "@npm//react",
      "@npm//react-error-boundary",
      "//devtools/messenger:@player-tools/devtools-messenger",
      "//devtools/types:@player-tools/devtools-types",
    ],
)
