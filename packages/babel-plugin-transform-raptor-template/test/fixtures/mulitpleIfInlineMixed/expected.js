export default function tmpl($api, $cmp, $slotset, $ctx) {
    const m = $ctx.memoized || ($ctx.memoized = {});
    return [$api.h(
        "section",
        {},
        [$cmp.isTrue ? $api.h(
            "p",
            {},
            ["1"]
        ) : undefined, $cmp.foo, $cmp.isTrue ? $api.h(
            "p",
            {},
            ["3"]
        ) : undefined]
    )];
}
tmpl.ids = ["isTrue", "foo"];
