# mu

A Discord bot to bring you inner peace or your innards in pieces.

## Quickstart

```bash
git clone https://github.com/oqkr/mu
cd mu
yarn install          # or npm install
yarn run clean-start  # or npm run clean-start
```

You should create a [config.toml](#config.toml) file and/or set appropriate
[environment variables](#environment-variables) first, though.

## Configuration

You can configure mu with environment variables, a configuration file, or both.
If a configuration item is set in both places, the environment variable wins.

The only required item is the Discord token.

### config.toml

To generate a default [config file](examples/config.example.toml) in
`$HOME/.config/mu/config.tml`, run these commands:

```bash
mkdir -m 0700 ~/.config
mkdir -m 0700 ~/.config/mu
cd path_to_mu_root_directory
cp examples/config.example.toml ~/.config/mu/config.toml
```

### Environment Variables

Every configuration item has a corresponding environment variable. Check out
the example [config file](examples/config.example.toml) to see what they are.

## Contributing to this project

Anyone and everyone is welcome to contribute. Please take a moment to
review the [guidelines for contributing](CONTRIBUTING.md).

* [Bug reports](CONTRIBUTING.md#bugs)
* [Feature requests](CONTRIBUTING.md#features)
* [Pull requests](CONTRIBUTING.md#pull-requests)
