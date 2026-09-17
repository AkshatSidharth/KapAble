Tests delete-rename-write order
<kapable-delete path="src/main.tsx">
</kapable-delete>
<kapable-rename from="src/App.tsx" to="src/main.tsx">
</kapable-rename>
<kapable-write path="src/main.tsx" description="final main.tsx file.">
finalMainTsxFileWithError();
</kapable-write>
EOM
