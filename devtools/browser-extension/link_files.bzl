def _link_files_impl(ctx):
    output_dir = ctx.actions.declare_directory("linked_files")
    # output_dir = ctx.actions.declare_directory(".plasmo")
    cmd = """
    for file in $(find . -type f); do
        dir=$(dirname $file)
        mkdir -p {}/$dir
        ln -s $file {}/$file
    done
    """.format(output_dir.path, output_dir.path)
    ctx.actions.run_shell(
        inputs = ctx.files.srcs,
        outputs = [output_dir],
        command = cmd,
    )
    return [DefaultInfo(files = depset([output_dir]))]

link_files = rule(
    implementation = _link_files_impl,
    attrs = {
        "srcs": attr.label_list(allow_files = True),
    },
)

