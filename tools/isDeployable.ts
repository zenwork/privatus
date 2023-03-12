const dirEntries = Deno.readDirSync('.changeset')

function hasUnreleasedChangesets(): boolean {
    let count = 0
    for (const dirEntry of dirEntries) {
        count++
    }

    const found = count > 1
    console.log(`-> changesets found: ${found}`)
    return found;
}

async function isMain(): Promise<boolean> {
    const cmd = Deno.run({
        cmd: ['git', 'rev-parse', '--abbrev-ref', 'HEAD'],
        stdout: 'piped',
        stderr: 'piped'
    })
    const output = await cmd.output()
    cmd.close()
    const currentBranch = new TextDecoder().decode(output)
    const check = currentBranch.replace('\n','') === 'main'
    console.log(`-> branch is main  : ${check}`)
    return check
}

const onMain = await isMain()
const changesets = hasUnreleasedChangesets()
if ((onMain && !changesets) || !onMain) {
    console.log('deploy:' + '\u{2705}' + '   ')
    Deno.exit(0)
} else {
    console.log('deploy:' + '\u{274C}' + '   ')
    Deno.exit(1)
}
