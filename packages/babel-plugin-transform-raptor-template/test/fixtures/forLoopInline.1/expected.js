export default function tmpl($api, $cmp, $slotset, $ctx) {
    const m = $ctx.memoized || ($ctx.memoized = {});
    return [$api.h(
        "section",
        {},
        $api.i($cmp.items, function (item, index) {
            return $api.h(
                "div",
                {
                    classMap: {
                        "my-list": true
                    }
                },
                [$api.h(
                    "p",
                    {},
                    [item]
                )]
            );
        })
    )];
}
tmpl.ids = ["items"];
