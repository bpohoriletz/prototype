# ANSI color codes
RED=\\033[31m
GREEN=\\033[32m
YELLOW=\\033[33m
BLUE=\\033[34m
RESET=\\033[0m
# Function to apply color
comma := ,
define color
$(1)$(2)$(RESET)
endef
# AWS Account data
AWS_ACCOUNT := $(shell aws sts get-caller-identity --profile=my --query "Account" --output text)

check: check-node check-aws-cli check-account check-git ## Verify required toools are installed
	@echo $(call color, $(GREEN), "********* All Set! ***********")
check-node:
	@printf "Verifying Node.js ...."
	@node -v > /dev/null 2>&1 || { echo $(call color, $(RED), no$(comma) please fix); exit 1; }
	@echo $(call color, $(YELLOW), yes $$(node -v))
check-aws-cli:
	@printf "Verifying AWS CLI ...."
	@aws --version > /dev/null 2>&1 || { echo $(call color, $(RED), no$(comma) please fix); exit 1; }
	@echo $(call color, $(YELLOW), yes $$(aws --version))
check-account:
	@echo "Verifying AWS credentials set for 'my' profile."
	@printf "executing aws sts get-caller-identity $(BLUE)--profile=my$(RESET) ...."
	@aws sts get-caller-identity --profile=my > /dev/null 2>&1 || { echo $(call color, $(RED), no$(comma) please fix); exit 1; }
	@echo $(call color, $(YELLOW), got Account: $(AWS_ACCOUNT))
check-git:
	@printf "Verifying Git ........"
	@git -v > /dev/null 2>&1 || { echo $(call color, $(RED), O_O$(comma) please fix); exit 1; }
	@echo $(call color, $(YELLOW), yes $$(git -v))
