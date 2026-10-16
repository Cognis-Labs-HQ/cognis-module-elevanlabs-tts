# Pending work

## Host-backed operational credentials

Review [5544779935](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/pull/1#pullrequestreview-5544779935) requests storing the provider API key through a host secret store and retaining only an opaque reference in module configuration. This is not implemented: the installed Cognis public contract exposes concealed configuration **responses** (`apiKeyConfigured`, an unchanged `****` mask, and empty replacement preservation), but no operational credential-store capability. See [the host configuration contract](https://github.com/Cognis-Labs-HQ/Cognis/blob/feature-update-external-package-contract-definitions/src/docs/modules/external.en.md#module-preferences).

API keys currently remain in the ordinary configuration database. Masking does not protect database readers or backups. Completing this finding requires a host-owned secure credential store with a public ctx interface, protected persistence separate from database backups, ownership and deletion semantics, and a migration from existing plaintext configuration. The user keyring stores browser-encrypted account vaults; it cannot supply a server-side provider credential. Do not invent an unavailable host capability, store a decryption key beside its ciphertext, or silently drop restart persistence as a substitute.
