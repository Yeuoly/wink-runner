const go_template = `package main
import "fmt"

func main() {
	fmt.Println("Hello, World!")
}
`
const python_template = `print("Hello, World!")`
const node_template = `console.log("Hello, World!")`

export const languages = [{
    'language': 'Go',
    'template': go_template,
    'extension': 'go',
}, {
    'language': 'Python',
    'template': python_template,
    'extension': 'py',
}, {
    'language': 'Node',
    'template': node_template,
    'extension': 'js',
}];