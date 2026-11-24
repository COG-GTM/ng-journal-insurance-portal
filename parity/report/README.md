# Parity report

Baseline: 16 pass / 0 fail. Upgraded: 16 pass / 0 fail.

## Flows

| Page / flow | Baseline | Upgraded |
| --- | --- | --- |
| screens › capture every page | pass | pass |
| claim › list shows every claim and opens details | pass | pass |
| claim › details shows claim and contract fields | pass | pass |
| claim › create validates and saves a claim | pass | pass |
| complaint › list shows every complaint and opens details | pass | pass |
| complaint › details shows fields and links to the customer | pass | pass |
| complaint › create validates and saves a complaint | pass | pass |
| contract › list shows every contract with headers and opens details | pass | pass |
| contract › details shows fields and links to customer and edit | pass | pass |
| contract › create validates, saves and edit updates status | pass | pass |
| customer › list shows every customer and opens details | pass | pass |
| customer › details shows person and address | pass | pass |
| root redirects to home and shows the shell | pass | pass |
| home cards navigate to each list | pass | pass |
| sidebar navigates and highlights the active route | pass | pass |
| unknown route shows page not found | pass | pass |

## Screenshots (pixel diff, threshold 0.1)

| Page | Diff % | Side by side (baseline left, upgraded right) |
| --- | --- | --- |
| claim-create | 0.00% | [image](side-by-side/claim-create.png) |
| claim-details | 0.00% | [image](side-by-side/claim-details.png) |
| claim-list | 0.00% | [image](side-by-side/claim-list.png) |
| complaint-create | 0.00% | [image](side-by-side/complaint-create.png) |
| complaint-details | 0.00% | [image](side-by-side/complaint-details.png) |
| complaint-list | 0.00% | [image](side-by-side/complaint-list.png) |
| contract-create | 0.00% | [image](side-by-side/contract-create.png) |
| contract-details | 0.06% | [image](side-by-side/contract-details.png) |
| contract-edit | 0.00% | [image](side-by-side/contract-edit.png) |
| contract-list | 0.00% | [image](side-by-side/contract-list.png) |
| customer-details | 0.00% | [image](side-by-side/customer-details.png) |
| customer-list | 0.00% | [image](side-by-side/customer-list.png) |
| home | 0.00% | [image](side-by-side/home.png) |
| not-found | 0.00% | [image](side-by-side/not-found.png) |

## Build metrics

Production build of insurance-portal, cold (rm -rf .angular/cache, --skip-nx-cache), Node 20.20.2, same VM.

| | Baseline | Upgraded |
| --- | --- | --- |
| angular | 16.0.x | 21.2.x |
| builder | @angular-devkit/build-angular:browser (webpack) | @angular/build:application (esbuild) |
| buildSeconds | 17.3 | 7.3 |
| initialRaw | 1.38 MB | 1.53 MB |
| initialTransfer | 219.08 kB | 261.18 kB |
| distBytes | 1581410 | 1876962 |
